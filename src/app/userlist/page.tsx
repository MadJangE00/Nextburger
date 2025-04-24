
import { supabase } from "@/lib/supabaseClient";


export default function UserListPage() {
    const userListdata = async() => {
        const {data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', {ascending:false});
    }

    return <div>
        <h1>user list</h1>    
        
        </div>
    

}