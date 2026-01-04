
export default function MenuAcercaDe({ mobileMode = false }: { mobileMode?: boolean }) {


  return (
    <div className={mobileMode ? "w-full flex" : "h-full w-full grid grid-rows-[repeat(6,1fr)] grid-cols-[repeat(18,1fr)]"}>
      
    </div>
  )
}
