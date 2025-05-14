import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="/signin" passHref>
              <Button className="w-full sm:w-auto gap-2 group">
                Get Started
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
    </div>
  )
}
