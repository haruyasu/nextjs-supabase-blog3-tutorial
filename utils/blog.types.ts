export interface BlogListType {
  id: string
  created_at: string
  title: string
  content: string
  image_url: string
  profiles: ProfileType
}

export interface BlogDetailType {
  id: string
  created_at: string
  title: string
  content: string
  image_url: string
  profile_id: string
  profiles: ProfileType
  comments: CommentType[]
}

export interface LikeType {
  user_id: string
}

export interface ProfileType {
  id: string
  avatar_url: string | null
  name: string | null
}

export interface CommentType {
  id: string
  content: string
  created_at: string
  profiles: ProfileType
  likes: LikeType[]
}

export interface SearchType {
  searchParams: {
    page: string
  }
}
