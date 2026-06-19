import { Star } from "lucide-react";

export default function Rating() {
    return <div className="flex gap-1"><Star className="h-5 w-5 fill-amber-400 stroke-amber-400" /><Star className="h-5 w-5 stroke-muted-foreground" /></div>
}