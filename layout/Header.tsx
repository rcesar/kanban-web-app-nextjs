import Button from '../components/UI/Button'
import LogoDarkIcon from '@/icons/logo-dark.svg'
import BoardIcon from '@/icons/icon-board.svg'
import LogoLightIcon from '@/icons/logo-light.svg'
import LogoMobileIcon from '@/icons/logo-mobile.svg'
import ChevronDownIcon from '@/icons/icon-chevron-down.svg'
import AddIcon from '@/icons/icon-add-task-mobile.svg'
import Dropdown from '@/components/UI/Dropdown'
import ModalEnum from '@/model/ModalEnum'
import { useQuery } from '@tanstack/react-query'
import Board from '@/model/Board'
import useUiContext from '@/hooks/useUiContext'
import ToggleTheme from '@/components/ToggleTheme'
const Header = () => {
  const { activeBoard, setActiveModal } = useUiContext()
  const { data } = useQuery<{ boards: Board[] }>({ queryKey: ['boards'] })
  const isDisables =
    data?.boards?.length === 0 ||
    data?.boards?.[activeBoard]?.columns.length === 0
  return (
    <div className='flex  items-center justify-between  '>
      {/* Desktop Header */}
      <div className='sm:flex  items-center justify-between border-b border-b-gray1 dark:border-b-black1  w-full hidden'>
        <div className='px-8 py-8 w-[260px] md:w-[300px] '>
          <LogoDarkIcon className='dark:hidden' />
          <LogoLightIcon className='dark:block hidden' />
        </div>
        <div className='px-7  flex flex-1 items-center justify-end  '>
          {/* <h1 className='text-2xl md:text-3xl'>Platform Launch</h1> */}
          <div className='flex items-center gap-6'>
            <span
              className=' flex gap-x-4 items-center justify-center text-zinc-800 dark:text-zinc-200 cursor-pointer'
              onClick={() => setActiveModal(ModalEnum.CREATE_BOARD)}
            >
              <span>
                <BoardIcon />
              </span>
              <h3>Create New Retro</h3>
            </span>
            <Button
              label='+ Add New Task'
              type='primary large'
              disabled={isDisables}
              onClick={() => setActiveModal(ModalEnum.CREATE_TASK)}
            />

            <ToggleTheme />
            <Dropdown
              disable={data?.boards.length === 0}
              items={[
                {
                  label: 'Edit Board',
                  onClick: () => setActiveModal(ModalEnum.EDIT_BOARD),
                  className: 'text-gray3'
                },
                {
                  label: 'Delete Board',
                  onClick: () => setActiveModal(ModalEnum.DELETE_BOARD),
                  className: 'text-destructive2'
                }
              ]}
            />
          </div>
        </div>
      </div>
      {/* Mobile Header */}
      <div className='sm:hidden  items-center justify-between  w-full flex px-4 py-5'>
        <div
          className='flex'
          onClick={() => setActiveModal(ModalEnum.MOBILE_MENU)}
        >
          <LogoMobileIcon className='mr-4' />
          <div className='flex items-center gap-x-2'>
            <h2 className=''>{data?.boards?.[activeBoard]?.name}</h2>
            <ChevronDownIcon />
          </div>
        </div>
        <div className='flex items-center gap-x-4'>
          <button
            className={`bg-primary2 py-4 px-6 rounded-full ${
              isDisables ? 'opacity-25 cursor-not-allowed' : ''
            }`}
            onClick={() => {
              setActiveModal(ModalEnum.CREATE_TASK)
            }}
            disabled={isDisables}
          >
            <AddIcon />
          </button>
          <Dropdown
            disable={data?.boards.length === 0}
            items={[
              {
                label: 'Edit Board',
                onClick: () => setActiveModal(ModalEnum.EDIT_BOARD),
                className: 'text-gray3'
              },
              {
                label: 'Delete Board',
                onClick: () => setActiveModal(ModalEnum.DELETE_BOARD),
                className: 'text-destructive2'
              }
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export default Header
