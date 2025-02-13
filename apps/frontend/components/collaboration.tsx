import { useUIstore } from "@/stores";
import { Button } from "./ui/button";
import { CollaborationDialog } from "./collaboration-dialog";

const Collaboration = () => {
    const { setDialogState } = useUIstore();

    const handleStartCollaboration = async () => {
        setDialogState("collaboration", true);

    };
    return ( 
        <div className="flex justify-end absolute right-4 top-4">
            <Button 
                variant={"default"} 
                onClick={handleStartCollaboration}
            >
                Start Live Collaboration
            </Button>
            <CollaborationDialog  />
        </div>
     );
}
 
export default Collaboration;