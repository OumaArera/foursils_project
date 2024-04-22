import React, {useState} from "react"

const SEARCH_DB_URL = "http://127.0.0.1:5000/user/search/courses"

const ReactFunc = () =>{

    const [search, setSearch] = useState({
        search: ""
    })

    const fetchData = async () =>{
        // const userSearch = "JavaScript"
        
        try{
            const response = await fetch(`${SEARCH_DB_URL}/${search}`)
            if (response.ok){
                data = await response.json()
            }else{
                return "There was an error"
            }
    
        }catch (err){
            console.log(err)
        }
    
    }
    fetchData()

    const handleSearch = () =>{
        const { name, value } = event.target;
        setSearch(prevData => ({
            ...prevData,
            [name]: value
        }));
        
    }

    return (
        <div>
            <input 
                type="text" 
                placeholder="Search"
                name="search"
                value={search.search}
                onChange={handleSearch}
            
            />
        </div>
    )


}

export default ReactFunc

