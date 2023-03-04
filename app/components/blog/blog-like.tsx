'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '../supabase-provider'
import { HeartIcon } from '@heroicons/react/24/solid'

import useStore from '../../../store'

import type { CommentType } from '../../../utils/blog.types'
type PageProps = {
  data: CommentType
  login: boolean
}

// コメントいいね
const BlogLike = ({ data, login }: PageProps) => {
  const router = useRouter()
  const { supabase } = useSupabase()
  const { user } = useStore()
  const [loadingLike, setLoadingLike] = useState('')

  // いいねボタンクリック
  const commentLike = async (comment_id: string, handle: boolean) => {
    setLoadingLike(comment_id)

    if (handle) {
      // いいねを新規作成
      await supabase.from('likes').insert({
        user_id: user.id!,
        comment_id,
      })
    } else {
      // いいねを削除
      await supabase.from('likes').delete().match({ user_id: user.id, comment_id: comment_id })
    }

    // キャッシュクリア
    router.refresh()

    setLoadingLike('')
  }

  // いいねボタン表示
  const renderLike = (data: CommentType) => {
    // ログインチェック
    if (login) {
      // いいねしているユーザーをリスト化
      const user_id_list = data.likes.map((x) => x.user_id)

      if (loadingLike == data.id) {
        // ローディング
        return (
          <div className="h-4 w-4 animate-spin rounded-full border border-yellow-500 border-t-transparent" />
        )
      } else if (user_id_list.includes(user.id!)) {
        // いいね済み
        return (
          <div className="text-pink-500 cursor-pointer" onClick={() => commentLike(data.id, false)}>
            <HeartIcon className="h-5 w-5" />
          </div>
        )
      } else {
        // いいね無し
        return (
          <div className="text-gray-400 cursor-pointer" onClick={() => commentLike(data.id, true)}>
            <HeartIcon className="h-5 w-5" />
          </div>
        )
      }
    } else {
      // 初期値
      return (
        <div className="text-gray-400">
          <HeartIcon className="h-5 w-5" />
        </div>
      )
    }
  }

  return <div>{renderLike(data)}</div>
}

export default BlogLike
