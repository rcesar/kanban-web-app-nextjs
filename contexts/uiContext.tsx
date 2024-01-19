'use client'

import ModalEnum from '@/model/ModalEnum'
import { createContext, useState } from 'react'

interface IUiContextProps {
  activeBoard: number
  openedTask: { taskIndex: number; colIndex: number } | undefined
  openedModal: ModalEnum | undefined
  sidebarIsOpen: boolean
  setActiveBoard: (value: number) => void
  setActiveModal: (value: ModalEnum | undefined) => void
  setOpenedTask: (
    value: { taskIndex: number; colIndex: number } | undefined
  ) => void
  toggleSidebar: () => void
}

const defaultValue: IUiContextProps = {
  activeBoard: 0,
  openedTask: undefined,
  openedModal: undefined,
  sidebarIsOpen: true,
  setActiveBoard: (value: number) => {
    throw new Error('Should be configured')
  },
  setActiveModal: (value: ModalEnum | undefined) => {
    throw new Error('Should be configured')
  },
  setOpenedTask: (
    value: { taskIndex: number; colIndex: number } | undefined
  ) => {
    throw new Error('Should be configured')
  },
  toggleSidebar: () => {
    throw new Error('Should be configured')
  }
}

const UiContext = createContext(defaultValue)

export default UiContext

export const UiContextProvider = ({ children }: any) => {
  const [activeBoard, setActiveBoardCore] = useState<number>(0)
  const [openedTask, setOpenedTaskCore] = useState<
    { taskIndex: number; colIndex: number } | undefined
  >(undefined)
  const [openedModal, setOpenedModalCore] = useState<ModalEnum | undefined>(
    undefined
  )
  const [sidebarIsOpen, setSidebarIsOpenCore] = useState<boolean>(true)

  const contextProps: IUiContextProps = {
    setActiveBoard: (value: number) => {
      setActiveBoardCore(value)
    },

    setActiveModal: (value: ModalEnum | undefined) => {
      setOpenedModalCore(value)
    },

    setOpenedTask: (
      value: { taskIndex: number; colIndex: number } | undefined
    ) => {
      setOpenedTaskCore(value)
    },

    toggleSidebar: () => {
      setSidebarIsOpenCore(!sidebarIsOpen)
    },
    activeBoard,
    openedModal,
    openedTask,
    sidebarIsOpen
  }

  return (
    <UiContext.Provider value={contextProps}>{children}</UiContext.Provider>
  )
}
