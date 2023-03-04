'use client'

import { useRouter } from 'next/navigation'
import MyPagenation from '../pagination'

type PageProps = {
  allCnt: number
  perPage: number
}

// ブログページネーション
const BlogPagination = ({ allCnt, perPage }: PageProps) => {
  const router = useRouter()

  const paginationHandler = ({ selected }: { selected: number }): void => {
    router.push(`/?page=${selected + 1}`)
  }

  return <MyPagenation allCnt={allCnt} perPage={perPage} clickPagenation={paginationHandler} />
}

export default BlogPagination
