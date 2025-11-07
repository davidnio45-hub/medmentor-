import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { Page } from '../types';
import { PageWrapper } from '../components/PageWrapper';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';
import { generateTextFromPrompt } from '../services/geminiService';
import { CpuChipIcon, PhotoIcon, UsersIcon } from '../components/common/icons';

interface CommunityPageProps {
  page: Page;
}

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

type Tab = 'ai' | 'wall';

const DocDavTab: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const docDavPrompt = "You are Doc Dav, a friendly and knowledgeable AI assistant for medical students. Answer this question clearly, accurately, and in a student-friendly way using current medical knowledge.";

    useEffect(() => {
        chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        const userMessage: Message = { sender: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const fullPrompt = `${docDavPrompt}\n\nQuestion: ${userInput}`;
            const aiResponseText = await generateTextFromPrompt(fullPrompt, ''); // userInput is part of the prompt
            const aiMessage: Message = { sender: 'ai', text: aiResponseText };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            const errorMessage: Message = { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[60vh]">
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 bg-slate-50 rounded-lg border space-y-4">
                <div className="flex justify-start">
                    <div className="max-w-lg p-3 rounded-xl bg-slate-200 text-slate-800">
                        <p>Hi! I'm Doc Dav, your AI medical assistant. Ask me anything!</p>
                    </div>
                </div>
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-lg p-3 rounded-xl ${msg.sender === 'user' ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                            <div className="prose max-w-none prose-p:my-1" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }}></div>
                        </div>
                    </div>
                ))}
                {isLoading && <div className="flex justify-start"><div className="max-w-lg p-3 rounded-xl bg-slate-200"><Spinner /></div></div>}
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-4 mt-4">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask Doc Dav anything medical…"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 transition flex-grow"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !userInput.trim()} className="px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 disabled:bg-slate-400">
                    Ask
                </button>
            </form>
        </div>
    );
}

const CommunityWallTab: React.FC = () => {
    interface Post {
        id: number;
        author: string;
        avatar: string;
        content: string;
        timestamp: string;
    }

    const [posts, setPosts] = useState<Post[]>([
        { id: 1, author: 'Dr. Anya Sharma', avatar: 'AS', content: 'Just a reminder to everyone prepping for Step 1: focus on high-yield concepts! Don\'t get bogged down in minutiae. You got this!', timestamp: '10m ago' },
        { id: 2, author: 'Ben Carter (M3)', avatar: 'BC', content: 'Anyone have a good mnemonic for the cranial nerves? The classic one is getting old.', timestamp: '5m ago' },
    ]);
    const [newPostContent, setNewPostContent] = useState('');

    const handleShare = () => {
        if (!newPostContent.trim()) return;

        const newPost: Post = {
            id: Date.now(),
            author: 'David N. (You)',
            avatar: 'DN',
            content: newPostContent,
            timestamp: 'Just now',
        };

        setPosts(prevPosts => [newPost, ...prevPosts]);
        setNewPostContent('');
    };

    return (
        <div className="h-[60vh] flex flex-col">
            <div className="border border-slate-200 rounded-lg p-4 space-y-2">
                <textarea 
                    className="w-full p-2 border rounded-md" 
                    placeholder="Write something to the community..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                />
                <div className="flex justify-between items-center">
                    <button className="flex items-center gap-2 text-slate-400 p-2 rounded-lg cursor-not-allowed" disabled>
                        <PhotoIcon className="w-5 h-5" />
                        Upload (soon)
                    </button>
                    <button 
                        onClick={handleShare}
                        className="px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-sm hover:bg-sky-700 disabled:bg-slate-400"
                        disabled={!newPostContent.trim()}
                    >
                        Share
                    </button>
                </div>
            </div>
            <div className="flex-1 mt-4 p-4 bg-slate-50 rounded-lg border overflow-y-auto space-y-4">
                 {posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center h-full">
                        <UsersIcon className="mx-auto h-16 w-16 text-slate-300" />
                        <h3 className="mt-4 text-xl font-semibold text-gray-700">It's quiet in here...</h3>
                        <p className="mt-1 text-base text-gray-500">Be the first to share something with the community!</p>
                    </div>
                 ) : (
                    posts.map(post => (
                        <div key={post.id} className="flex items-start space-x-3 bg-white p-3 rounded-lg shadow-sm border animate-fade-in">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-200 text-sky-700 flex items-center justify-center font-bold">
                                {post.avatar}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-bold text-slate-800 text-sm">{post.author}</p>
                                    <p className="text-xs text-slate-400">{post.timestamp}</p>
                                </div>
                                <p className="text-slate-600 mt-1 text-sm whitespace-pre-wrap">{post.content}</p>
                            </div>
                        </div>
                    ))
                 )}
            </div>
        </div>
    );
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ page }) => {
    const [activeTab, setActiveTab] = useState<Tab>('ai');

    const tabs = [
        { id: 'ai', label: 'Talk to Doc Dav', icon: CpuChipIcon },
        { id: 'wall', label: 'Live Community Wall', icon: UsersIcon },
    ];
  
    return (
        <PageWrapper page={page}>
            <Card>
                <div className="border-b border-gray-200 mb-4">
                    <nav className="-mb-px flex space-x-6">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)} className={`flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                <tab.icon className="w-5 h-5"/>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div>
                    {activeTab === 'ai' ? <DocDavTab /> : <CommunityWallTab />}
                </div>
            </Card>
        </PageWrapper>
    );
};