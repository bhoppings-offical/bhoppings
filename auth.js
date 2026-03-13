import { ExpressAuth } from "@auth/express"
import GitHub from "@auth/express/providers/github"

export const authConfig = {
  providers: [GitHub],
  secret: process.env.AUTH_SECRET,
}
