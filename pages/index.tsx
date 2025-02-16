import { useEffect } from 'react'
import Header from '@/layout/Header'
import Sidebar from '@/layout/Sidebar'
import Tasks from '@/layout/Tasks'
import Board from '@/model/Board'
import { getData } from '@/utils/boards-fs'
import { useBoard } from '@/hooks/useBoard'

import { useDispatch, useSelector } from 'react-redux'
import {
  selectBoard,
  selectModal,
  selectSidebar,
  selectTask,
  setActiveModal,
  setOpenedTask
} from '@/store/uiSlice'

import CreateBoard from '@/components/CreateBoard'
import CreateTask from '@/components/CreateTask'
import Delete from '@/components/Delete'
import EditBoard from '@/components/EditBoard'
import Modal from '@/components/UI/Modal'
import ViewTask from '@/components/ViewTask'
import { useCreateBoard } from '@/hooks/useCreateBoard'
import { useDeleteBoard } from '@/hooks/useDeleteBoard'
import { useUpdateBoard } from '@/hooks/useUpdateBoard'

import ModalEnum from '@/model/ModalEnum'
import Task from '@/model/Task'
import EditTask from '@/components/EditTask'
import { DropResult, resetServerContext } from 'react-beautiful-dnd'
import MobileBoards from '@/components/MobileBoards'
import connectMongo from '@/database/connectMongo'
import BoardsModel from '@/database/data'
import Spinner from '@/components/UI/Spinner'
import Head from 'next/head'
import useUiContext from '@/hooks/useUiContext'

interface HomeProps {
  prefetchedData: { boards: Board[] }
}
const Home: React.FC<HomeProps> = ({ prefetchedData = { boards: [] } }) => {
  const boards = useBoard(prefetchedData) //remote states

  const { isDeleting, deleteBoard } = useDeleteBoard()
  const { isCreating, createBoard } = useCreateBoard()
  const { isUpdating, updateBoard } = useUpdateBoard()

  const {
    setOpenedTask,
    setActiveModal,
    openedModal,
    openedTask,
    sidebarIsOpen,
    activeBoard
  } = useUiContext()

  useEffect(() => {
    const html = document.querySelector('html')
    html?.classList.add(localStorage.getItem('theme') || 'light')
    return () => {}
  }, [])

  const handleAddNewTask = (task: Task) => {
    const status = task.status
    const columnIndex = boards[activeBoard].columns.findIndex(
      (el: { name: string; tasks: Task[] }) => el.name === status
    )

    if (columnIndex > -1) {
      const board = { ...boards[activeBoard] }
      board.columns[columnIndex].tasks.push(task)
      updateBoard({ id: activeBoard.toString(), board })
    }
  }

  const handleDeleteTask = () => {
    const board = { ...boards[activeBoard] }
    if (openedTask) {
      board?.columns[openedTask.colIndex]?.tasks?.splice(
        openedTask.taskIndex,
        1
      )
      updateBoard({ id: activeBoard.toString(), board })
      setOpenedTask(undefined)
    }
  }

  const handleChangeTask = (task: Task) => {
    const board = { ...boards[activeBoard] }
    if (openedTask) {
      board.columns[openedTask.colIndex].tasks[openedTask.taskIndex] = task
      updateBoard({ id: activeBoard.toString(), board })
    }
  }

  const handleEditTask = (task: Task) => {
    const board = { ...boards[activeBoard] }

    if (openedTask) {
      // get a copy of the old task.
      const oldTask =
        board.columns[openedTask.colIndex].tasks[openedTask.taskIndex]

      //check if status has changed
      const statusIsChanged = oldTask.status !== task.status

      if (!statusIsChanged) {
        board.columns[openedTask.colIndex].tasks[openedTask.taskIndex] = task
        updateBoard({ id: activeBoard.toString(), board })
        return
      }

      // if status has changed remove it from previous col and add it to the new col
      board.columns[openedTask.colIndex].tasks.splice(openedTask.taskIndex, 1)
      //add the task to target column. first find it's index
      const targetColIndex = board.columns.findIndex(
        (el: { name: string; tasks: Task[] }) => el.name === task.status
      )
      if (targetColIndex > -1) {
        board.columns[targetColIndex].tasks.push(task)
      }
      updateBoard({ id: activeBoard.toString(), board })
    }
  }

  const handleChangeTaskStatus = (status: string) => {
    const board = { ...boards[activeBoard] }
    if (openedTask) {
      //first of all get a copy of the task.
      const updatedTask =
        board.columns[openedTask.colIndex].tasks[openedTask.taskIndex]
      updatedTask.status = status

      //delete task from current column
      board.columns[openedTask.colIndex].tasks.splice(openedTask.taskIndex, 1)

      //add the task to target column. first find it's index
      const targetColIndex = board.columns.findIndex(
        (el: { name: string; tasks: Task[] }) => el.name === status
      )

      if (targetColIndex > -1) {
        board.columns[targetColIndex].tasks.push(updatedTask)
      }
      const openedTaskOld = { ...openedTask }

      setOpenedTask({
        taskIndex: boards[activeBoard].columns[targetColIndex].tasks.length - 1,
        colIndex: targetColIndex
      })

      //finally update global state of boards
      updateBoard(
        { id: activeBoard.toString(), board },
        {
          onError: () => {
            setOpenedTask(openedTaskOld)
          }
        }
      )
    }
  }

  const reorder = (list: Task[], startIndex: number, endIndex: number) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }

  const handleDragEnd = ({ source, destination }: DropResult) => {
    if (!destination) {
      return
    }

    const board = { ...boards[activeBoard] }

    const srcCol = parseInt(source.droppableId)
    const desCol = parseInt(destination.droppableId)

    if (srcCol === desCol) {
      const updatedTasks = reorder(
        [...board.columns[srcCol].tasks],
        source.index,
        destination.index
      )
      board.columns[srcCol].tasks = updatedTasks
      updateBoard({ id: activeBoard.toString(), board })

      return
    }

    //add to destionation col
    board.columns[desCol].tasks.splice(
      destination.index,
      0,
      board.columns[srcCol].tasks[source.index]
    )

    //remove task from src
    board.columns[srcCol].tasks.splice(source.index, 1)
    updateBoard({ id: activeBoard.toString(), board })
  }

  return (
    <>
      <Head>
        <title>Kanban webapp</title>
      </Head>
      <main className='text-black dark:text-white bg-white dark:bg-black2 h-screen flex'>
        <div className='flex flex-col overflow-hidden w-full'>
          <Header />
          <div
            className={`app-container app-container--visible`}
          >
            {/* <Sidebar /> */}
            <Tasks onDragEnd={handleDragEnd} />
          </div>
          {/* liading spinner */}
          {(isDeleting || isUpdating || isCreating) && <Spinner />}
        </div>
        {openedModal === ModalEnum.CREATE_BOARD && (
          <Modal onClickBackdrop={() => setActiveModal(undefined)}>
            <CreateBoard onCreateBoard={(board: Board) => createBoard(board)} />
          </Modal>
        )}

        {openedModal === ModalEnum.EDIT_BOARD && (
          <Modal onClickBackdrop={() => setActiveModal(undefined)}>
            <EditBoard
              board={boards?.[activeBoard]}
              onEditBoard={(board: Board) =>
                updateBoard({ id: activeBoard.toString(), board })
              }
            />
          </Modal>
        )}

        {openedModal === ModalEnum.DELETE_BOARD && (
          <Modal onClickBackdrop={() => setActiveModal(undefined)}>
            <Delete
              title='Delete this board?'
              description={`Are you sure you want to delete the ‘${boards[activeBoard].name}’ board? This action will remove all columns and tasks and cannot be reversed.`}
              onCancel={() => setActiveModal(undefined)}
              onConfirm={() => deleteBoard(activeBoard.toString())}
            />
          </Modal>
        )}

        {openedModal === ModalEnum.CREATE_TASK && (
          <Modal
            onClickBackdrop={() => {
              setActiveModal(undefined)
            }}
          >
            <CreateTask
              columns={boards[activeBoard].columns.map(
                (col: { name: string; tasks: Task[] }) => {
                  return { label: col.name, value: col.name }
                }
              )}
              onCreateTask={handleAddNewTask}
            />
          </Modal>
        )}

        {openedTask && openedModal === ModalEnum.EDIT_TASK && (
          <Modal
            onClickBackdrop={() => {
              setActiveModal(undefined)
              setOpenedTask(undefined)
            }}
          >
            <EditTask
              task={
                boards[activeBoard].columns[openedTask.colIndex].tasks[
                  openedTask.taskIndex
                ]
              }
              columns={boards[activeBoard].columns.map(
                (col: { name: string; tasks: Task[] }) => {
                  return { label: col.name, value: col.name }
                }
              )}
              onEditTask={handleEditTask}
            />
          </Modal>
        )}

        {openedTask && openedModal === ModalEnum.VIEW_TASK && (
          <Modal
            onClickBackdrop={() => {
              setActiveModal(undefined)
              setOpenedTask(undefined)
            }}
          >
            <ViewTask
              task={
                boards[activeBoard].columns[openedTask.colIndex].tasks[
                  openedTask.taskIndex
                ]
              }
              columns={boards[activeBoard].columns.map(
                (col: { name: string; tasks: Task[] }) => {
                  return { label: col.name, value: col.name }
                }
              )}
              onChangeTask={handleChangeTask}
              handleChangeTaskStatus={handleChangeTaskStatus}
              onDeleteTask={() => setActiveModal(ModalEnum.DELETE_TASK)}
            />
          </Modal>
        )}

        {openedTask && openedModal === ModalEnum.DELETE_TASK && (
          <Modal onClickBackdrop={() => setOpenedTask(undefined)}>
            <Delete
              title='Delete this task?'
              description={`Are you sure you want to delete the ‘${
                boards[activeBoard].columns[openedTask.colIndex].tasks[
                  openedTask.taskIndex
                ].title
              }’ task and its subtasks? This action cannot be reversed.`}
              onCancel={() => {
                setActiveModal(undefined)
                setOpenedTask(undefined)
              }}
              onConfirm={handleDeleteTask}
            />
          </Modal>
        )}

        {openedModal === ModalEnum.MOBILE_MENU && (
          <Modal
            center={false}
            onClickBackdrop={() => setActiveModal(undefined)}
          >
            <MobileBoards />
          </Modal>
        )}
      </main>
    </>
  )
}

export default Home

export async function getServerSideProps () {
  await connectMongo()
  const data = await BoardsModel.find()
  let prefetchedData

  //if there is no data in data base read data.json file and fill it with it.
  if (data.length === 0) {
    prefetchedData = getData()
    await BoardsModel.create(prefetchedData)
  } else {
    const dbData = await BoardsModel.find()
    prefetchedData = JSON.parse(JSON.stringify(dbData[0]))
    console.log(prefetchedData)
  }

  resetServerContext()
  return { props: { prefetchedData } }
}
