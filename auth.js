import { ExpressAuth } from "@auth/express"
import GitHub from "@auth/express/providers/github"

export const authConfig = {
  providers: [GitHub],
  trustHost: true,
  secret: process.env.AUTH_SECRET,
}
