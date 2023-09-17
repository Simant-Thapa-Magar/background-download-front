import { useRef, useState } from "react"
import { API, NOT_DOWNLOADING, DOWNLOADING, DOWNLOAD_COMPLETE } from "./constants"

const DownloadFile = ({ fileName, fileLink }) => {

    const [downloadState, setDownloadState] = useState(NOT_DOWNLOADING)
    const [progress, setProgress] = useState(0)
    const downloadCompleted = useRef(0)

    const handleDownload = async (fileName, DownloadLink) => {
        setDownloadState(DOWNLOADING)
        const response = await fetch(`${API}${DownloadLink}`, {
            "method": "GET",
            "headers": {
                "Accept": "application/pdf"
            }
        })
        if (!response.body) return

        const contentLength = response.headers.get("Content-Length")

        const total = typeof contentLength == "string" && +contentLength

        let receivedLength = 0

        const reader = response.body.getReader()
        const chunks = []
        const start = Date.now();
        while (true) {
            if (total > 0) {
                const percent = 100 * receivedLength / total
                setProgress(+percent.toFixed())
            }
            const { value, done } = await reader.read()

            if (done) {
                const end = Date.now();
                downloadCompleted.current = (end - start) / 1000
                const blob = new Blob(chunks)
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = `${fileName}.pdf`
                a.click()
                setDownloadState(DOWNLOAD_COMPLETE)
                setTimeout(() => {
                    downloadCompleted.current = 0
                    setDownloadState(NOT_DOWNLOADING)
                }, [4000])
                break
            }
            chunks.push(value)
            receivedLength += value?.length
            console.log("value ", value?.length)
        }
    }

    return <div className="single-file-container">
        {fileName}
        <button disabled={downloadState?.value} onClick={() => handleDownload(fileName, fileLink)} className="download-button">{downloadState.label} {downloadState?.value === 2 && `in ${downloadCompleted.current}s`}</button>
        {downloadState?.value ? <div className="progress-bar">
            <div className="completed" style={{ width: `${progress}%` }} />
            <span className="progress-indicator">{progress}%</span>
        </div> : <></>}
    </div>
}

export default DownloadFile