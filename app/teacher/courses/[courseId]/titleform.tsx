"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const formSchema = z.object({
    title: z.string().min(1,{
        message: "Title is required"
    })
})
interface Props{
    initialData:{
        title: string
    }
    courseId: string
}
const TitleForm = ({initialData, courseId}:Props) => {
    const [isEditing, setisEditing] = useState(false)
    const toggleEdit = () => setisEditing((current) => !current)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    })
    const router = useRouter()
    const {isSubmitting, isValid} = form.formState
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            await axios.patch(`/api/course/${courseId}`, values)
            toast.success("Course updated")
            toggleEdit()
            router.refresh()
        }catch{
            toast.error("Error editing course, please try again.")
        }
    }
    return ( 
        <div className="mt-6 border rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Title
                <Button variant="ghost" onClick={toggleEdit}>
                {isEditing ? (
                    <div>
                    Cancel
                    </div>):(<>
                        <Pencil className="size-4 mr-2"/>
                        Edit Title
                    </>)}
                </Button>
            </div>
            {!isEditing && (
                <p className="text-sm mt-2">
                    {initialData.title}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-4">
                        <FormField
                        control={form.control}
                        name="title"
                        render={({field})=> (
                            <FormItem>
                            <FormControl>
                            <Input
                            disabled={isSubmitting}
                            placeholder="NYP but free and more budget"{
                                ...field
                            }/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                        )}/>
                        <div className="flex items-center gap-x-2">
                        <Button
                        disabled={!isValid || isSubmitting}
                        type="submit">
                            Save
                        </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
     );
}
 
export default TitleForm;