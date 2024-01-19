import Board from '@/model/Board'
import ModalEnum from '@/model/ModalEnum'
import { updateBoardApi } from '@/services/apiBoards'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useUiContext from './useUiContext'

export const useUpdateBoard = () => {
  const queryClient = useQueryClient()
  const { setActiveModal, openedModal } = useUiContext()

  const { mutate: updateBoard, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, board }: { id: string; board: Board }) =>
      updateBoardApi(id, board),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] })
      //do not close modal if viewing task.
      if (openedModal !== ModalEnum.VIEW_TASK) {
        setActiveModal(undefined)
      }
    }
  })
  return { isUpdating, updateBoard }
}
