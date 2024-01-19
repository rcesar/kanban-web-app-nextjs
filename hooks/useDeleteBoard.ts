import { deleteBoardApi } from '@/services/apiBoards'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useUiContext from './useUiContext'

export const useDeleteBoard = () => {
  const queryClient = useQueryClient()
  const { setActiveBoard, setActiveModal } = useUiContext()
  const { isLoading: isDeleting, mutate: deleteBoard } = useMutation({
    mutationFn: (id: string) => deleteBoardApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] })
      setActiveModal(undefined)
      setActiveBoard(0)
    },
    onError: () => {}
  })
  return { isDeleting, deleteBoard }
}
