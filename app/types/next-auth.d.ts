declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      publicUsername: string | null
      avatarId?: string | null
      colorIndex?: number | null
    }
  }

  interface User {
    id: string
    email: string
    publicUsername: string | null
    avatarId?: string | null
    colorIndex?: number | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    publicUsername: string | null
    email: string
    avatarId?: string | null
    colorIndex?: number | null
  }
}