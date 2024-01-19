import BoardsList from '@/components/BoardsList'
import ToggleTheme from '@/components/ToggleTheme'
import { useBoard } from '@/hooks/useBoard'
import HideIcon from '@/icons/icon-hide.svg'
import ShowIcon from '@/icons/icon-show-sidebar.svg'
import useUiContext from '@/hooks/useUiContext'

const Sidebar = () => {
  const boards = useBoard({ boards: [] })
  const { toggleSidebar, sidebarIsOpen } = useUiContext()
  return (
    <div className='w-[260px]  md:w-[300px] border-r border-r-gray1  dark:border-r-black1 relative  hidden sm:inline-block '>
      <BoardsList boards={boards} />
      <div className='absolute bottom-12 w-full px-4 space-y-4'>
        <ToggleTheme />
        <div
          className=' text-gray3 flex items-center gap-x-4 mx-auto  cursor-pointer'
          onClick={() => toggleSidebar()}
        >
          <HideIcon />
          <h3 className=''>Hide Sidebar</h3>
        </div>
      </div>
      {!sidebarIsOpen && (
        <div
          className='fixed bottom-9 bg-primary2  px-5 py-4 rounded-r-full cursor-pointer hover:bg-primary1 transition left-0'
          onClick={() => toggleSidebar()}
        >
          <ShowIcon />
        </div>
      )}
    </div>
  )
}

export default Sidebar
