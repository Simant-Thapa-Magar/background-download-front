import { useEffect, useState } from "react"
import { API } from "./constants"
import DownloadFile from "./DownloadFile"

const DownloadPage = () => {
    const [downloadList, setDownloadList] = useState([])

    useEffect(() => {
        const fetchList = async () => await fetch(API).then(res => res.json()).then(data => setDownloadList(data))
        fetchList()
    }, [])


    return <div className="download-list" >
        {
            downloadList?.map((d, i) =>
                <DownloadFile fileName={d?.file_name} fileLink={d?.download_link} key={i} />
            )
        }
    </div>
}

export default DownloadPage