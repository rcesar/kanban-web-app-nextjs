import Board from '@/model/Board'
import { createBoardApi } from '@/services/apiBoards'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useUiContext from './useUiContext'

export const useCreateBoard = () => {
  const { setActiveBoard, setActiveModal } = useUiContext()
  const queryClient = useQueryClient()
  const { mutate: createBoard, isLoading: isCreating } = useMutation({
    mutationFn: createBoardApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['boards']
      })
      const data = queryClient.getQueryData(['boards'])
      setActiveBoard((data as { boards: Board[] }).boards.length - 1)
      setActiveModal(undefined)
    }
  })
  return { isCreating, createBoard }
}
