import Sidebar from "../components/Sidebar";
import "../css/page/AiChat.css";
import useFetchChannels from "../hooks/useFetchChannels";
import React, {useEffect, useState} from "react";
import { useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import "../css/components/Pagination.css";
import axios from "axios";

const AIReports = () => {
    const [selectedChannelId, setSelectedChannelId] = useState(null);
    const {channels, loading, error} = useFetchChannels();
    const [reports, setReports] = useState([]);
    const [channelPage, setChannelPage] = useState(0);
    const [reportPage, setReportPage] = useState(0);
    const channelsPerPage = 10;
    const reportsPerPage = 7;

    const [searchParams] = useSearchParams();
    const selectedChannelIdFromQuery = searchParams.get("channelId");

    useEffect(() => {
        if (selectedChannelIdFromQuery) {
            setSelectedChannelId(Number(selectedChannelIdFromQuery));
        }
    }, [selectedChannelIdFromQuery]);

    useEffect(() => {
        setReportPage(0);
    }, [selectedChannelId]);

useEffect(() => {
    const fetchReports = async () => {
        try {
            let response;
            if (selectedChannelId) {
                response = await axios.get(`http://localhost:8080/report/channelId`, {
                    params: { channelId: Number(selectedChannelId) },
                });
            } else {
                response = await axios.get(`http://localhost:8080/report/all`);
            }
            const sortedReports = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setReports(sortedReports);
        } catch (err) {
            console.error("Error fetching reports:", err);
            setReports([]);
        }
    };
    fetchReports();
}, [selectedChannelId]);

    return (
        <div className="ai-chat-page">
            <Sidebar/>
            <main className="ai-chat-main with-sidebar">
                <header className="ai-chat-header">
                    <h1>AI 리포트</h1>
                </header>
                <div className="ai-chat-content">
                    <div className="chatbot-list">
                        <h3>텔레그램 채널</h3>
                        {loading && <p>Loading channels...</p>}
                        {error && <p>Error loading channels: {error}</p>}
                        <ul>
                            {channels
                                .slice(channelPage * channelsPerPage, (channelPage + 1) * channelsPerPage)
                                .map((channel) => (
                                    <li
                                        key={channel.id}
                                        className={`channel-item ${selectedChannelId === channel.id ? "active" : ""}`}
                                        onClick={() => {
                                            if (selectedChannelId === channel.id) {
                                                setSelectedChannelId(null); // 클릭된 항목이 이미 선택된 경우 전체 보기로 전환
                                            } else {
                                                setSelectedChannelId(channel.id);
                                            }
                                        }}
                                    >
                                        <div className="channel-info">
                                            <p className="channel-name">{channel.name}</p>
                                            <p className="channel-chatSendTime">
                                                {channel.createdAt}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                        <ReactPaginate
                            previousLabel={"<"}
                            nextLabel={">"}
                            pageCount={Math.ceil(channels.length / channelsPerPage)}
                            onPageChange={({selected}) => setChannelPage(selected)}
                            containerClassName={"pagination"}
                            activeClassName={"active"}
                        />
                    </div>
                    <div className="chat-window">
                        <h3>AI 분석 보고서</h3>
                        <p className="selected-channel-name">
                            {selectedChannelId
                                ? channels.find((ch) => ch.id === selectedChannelId)?.name
                                : "전체 채널 분석 리포트"}
                        </p>
                        <div className="report-list">
                            {reports.length > 0 ? (
                                <ul>
                                    {reports
                                        .slice(reportPage * reportsPerPage, (reportPage + 1) * reportsPerPage)
                                        .map((report) => (
                                            <li key={report.id} className="report-item">
                                                <p><strong>Channel:</strong> {
                                                    channels.find((ch) => ch.id === report.channelId)?.name || `ID: ${report.channelId}`
                                                }</p>
                                                <p><strong>Type:</strong> {report.type}</p>
                                                <p><strong>Content:</strong> {report.content}</p>
                                                <p><strong>Description:</strong> {report.description}</p>
                                                <p>
                                                    <strong>Created:</strong> {new Date(report.timestamp).toLocaleString()}
                                                </p>
                                            </li>
                                        ))}
                                </ul>
                            ) : (
                                <p>해당 채널에 대한 분석 리포트가 없습니다.</p>
                            )}
                        </div>
                        <ReactPaginate
                            previousLabel={"<"}
                            nextLabel={">"}
                            pageCount={Math.ceil(reports.length / reportsPerPage)}
                            onPageChange={({selected}) => setReportPage(selected)}
                            containerClassName={"pagination"}
                            activeClassName={"active"}
                        />
                        {/*<Chat channelId={selectedChannelId}/>*/}
                    </div>
                </div>
            </main>
        </div>
    );
};
export default AIReports;