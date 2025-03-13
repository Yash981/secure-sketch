import { useUIstore } from "@/stores";
import { Button } from "./ui/button";
import { CollaborationDialog } from "./collaboration-dialog";
import { usePathname } from "next/navigation";
import { CircleDot } from "lucide-react";

const Collaboration = () => {
    const { setDialogState } = useUIstore();
    const pathname = usePathname()
    const handleStartCollaboration = async () => {
        setDialogState("collaboration", true);

    };
    return ( 
        <div className="flex justify-end absolute right-4 top-4">
            <Button 
                variant={"default"} 
                onClick={handleStartCollaboration}
            >
                {pathname.startsWith('/collaboration') ? (
                    <>
                        <CircleDot className="w-4 h-4 mr-2" /> Live Now
                    </>
                ) : (
                    "Start Live Collaboration"
                )}
            </Button>
            <CollaborationDialog  />
        </div>
     );
}
 
export default Collaboration;