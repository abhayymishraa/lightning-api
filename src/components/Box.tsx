import { cn } from "@/lib/utils";
import Image from "next/image";

export function Box({ id, selected, onClick , href,title }:{id:number,selected:boolean,onClick:(id:number)=>void,href:string ,title:string}) {
    return (
      <div
        className={ cn(`box ${selected ? 'selected' : ''}  w-[300px] border hover:border-blue-500 min-h-16 min-w-16  flex  flex-col  items-center justify-center outline-none cursor-pointer`, selected === true ? 'border-blue-500' : '')}
        onClick={() => onClick(id)}
      >
        <Image src={href} alt="box" width={50} height={50} />
        <div className="flex text-center items-center" >
            <h1 className="text-center" >{title}</h1>
        </div>
      </div>
    );
  }