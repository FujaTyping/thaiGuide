import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <>
      <div className="flex flex-col gap-4 items-center justify-center h-screen w-full">
        <h1 className="font-bold text-2xl">thaiGuide 😁</h1>
        <Button className="font-bold">Build with Shadcn</Button>
      </div>
    </>
  );
}
