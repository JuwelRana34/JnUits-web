import Image from 'next/image'
import Link from 'next/link'

import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { getRandomColorClass } from '@/lib/getRandomColorClass'

interface PostCardProps {
  post: {
    id: string
    title: string
    content: string
    image?: string | null
    createdAt?: Date | null
    author: {
      name?: string | null
      image?: string | null
    }
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="border-border/40 bg-card/50 flex h-full flex-col overflow-hidden pt-0 backdrop-blur-sm transition-all hover:shadow-lg">
      <div className="bg-muted relative aspect-video w-full overflow-hidden">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            width={500}
            height={500}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center transition-transform duration-300 hover:scale-105 ${getRandomColorClass(post.id)}`}
          >
            <span className="text-4xl font-bold uppercase opacity-60">
              {post.title.slice(0, 5)}
            </span>
          </div>
        )}
      </div>

      <CardHeader className="space-y-2 p-4">
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <Badge
            variant="secondary"
            className="bg-cyan-100 font-normal text-cyan-600"
          >
            Blog
          </Badge>
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-3 w-3 text-amber-500" />
            <span className="text-amber-500">
              {post.createdAt
                ? format(new Date(post.createdAt), 'MMM d, yyyy')
                : 'N/A'}
            </span>
          </div>
        </div>
        <Link prefetch={false} href={`/blogs/${post.id}`} className="group">
          <h3 className="group-hover:text-primary line-clamp-2 text-xl font-bold tracking-tight transition-colors">
            {post.title}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className="grow p-4 pt-0">
        <p className="text-muted-foreground line-clamp-3 text-sm">
          {post.content.replace(/<[^>]*>?/gm, ' ')}
        </p>
      </CardContent>

      <CardFooter className="flex items-center gap-2 p-4 pt-0">
        <span className="text-muted-foreground text-xs font-medium">
          Post by : {post.author.name || 'Unknown Author'}
        </span>
      </CardFooter>
    </Card>
  )
}
