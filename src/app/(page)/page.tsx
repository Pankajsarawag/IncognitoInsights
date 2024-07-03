'use client'
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { useSession } from "next-auth/react"
import { User } from "next-auth"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import "./style.css"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

import message from '@/message.json';

export default function CarouselPlugin() {
  const { data: session } = useSession()
  const user: User = session?.user as User

  const route = useRouter()

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  if (!session || !user) {
    return (
 
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="carousel-container"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="carousel-content">
            {
              message.map((message, index) => (
                <CarouselItem key={index} className="carousel-item">
                  <Card className="card">
                    <CardHeader className="cardheader">
                      <h2>{message.title}</h2>
                      <Separator className="seprator" />
                    </CardHeader>
                    <CardContent className="cardcontent">
                      <p>{message.content}</p>
                    </CardContent>
                    <CardFooter className="cardfooter">
                      <p>{message.received}</p>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))
            }
          </CarouselContent>
        </Carousel>
  
    )
  } else {
    route.replace('/dashboard')
    return null; 
  }
}