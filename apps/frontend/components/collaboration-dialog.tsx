import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUIstore } from "@/stores"
import { Circle, Copy, Play } from "lucide-react"
import { useState } from "react"

export function CollaborationDialog() {
    const { dialogState, setDialogState } = useUIstore()
    const [startSession, setStartSession] = useState(false)
    const [inputValue,setInputValue] = useState('Yashwanth')
    return (
        <Dialog open={dialogState.collaboration} onOpenChange={() => setDialogState("collaboration", !dialogState.collaboration)}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader className="flex justify-center w-full items-center">
                    <DialogTitle>Live Collaboration</DialogTitle>
                    <DialogDescription>
                        Invite people to collaborate on your drawing.
                    </DialogDescription>
                    <DialogDescription className="text-center mt-9">
                        Don&apos;t worry, the session is end-to-end encrypted, and fully private.<br /> Not even our server can see what you draw.
                    </DialogDescription>
                </DialogHeader>
                {startSession && (
                    <div className="flex gap-4 py-4  justify-center items-center px-6 flex-col">
                        <div className="w-full flex flex-col justify-start items-start gap-3">
                            <Label htmlFor="name" className="text-right">
                                Your Name
                            </Label>
                            <Input id="name" type="text" value={inputValue}  className="w-full" onChange={(e)=>setInputValue(e.target.value)} />
                        </div>
                        <div className="flex justify-center items-end gap-3 w-full">
                            <div className="w-full flex flex-col justify-start items-start gap-3">
                                <Label htmlFor="name" className="text-right">
                                    Your Link
                                </Label>
                                <Input id="name" value="https://excalidraw.com/#room=8531bcf8fc30f26cd9b2,sGSg4Ciw4VzXC-YqV3gFqw" className="w-full" readOnly />
                            </div>
                            <Button variant={"secondary"}>
                                <Copy />
                            </Button>
                        </div>
                    </div>
                )}
                <DialogFooter className="sm:justify-center">
                    {!startSession ? (
                        <Button type="button" onClick={() => setStartSession(true)}>
                            <Play /> Start Session
                        </Button>
                    ) : (
                        <Button type="button" variant={"outline"} onClick={() => setStartSession(false)}>
                            <Circle fill="red" stroke="red" /> Stop Session
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
