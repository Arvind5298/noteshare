import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Download, Search, Lock, Filter, Eye } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import SecureNotesViewer from '../components/SecureNotesViewer';

interface Note {
  id: string;
  title: string;
  description: string;
  subject: string;
  semester: number;
  branch: string;
  file_url: string;
  downloads: number;
  created_at: string;
}

interface Subscription {
  id: string;
  plan: string;
  active: boolean;
  expires_at: string;
}

const NotesLibrary = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState<number | null>(null);
  const [branch, setBranch] = useState('CSE');
  const [hasSubscription, setHasSubscription] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchNotes();
    if (user) {
      checkSubscription();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setHasSubscription(!!data);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !subject || note.subject.toLowerCase() === subject.toLowerCase();
    const matchesSemester = semester === null || note.semester === semester;
    const matchesBranch = !branch || note.branch === branch;
    return matchesSearch && matchesSubject && matchesSemester && matchesBranch;
  });

  const subjects = Array.from(new Set(notes.map(note => note.subject)));
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleViewNote = (note: Note) => {
    if (!hasSubscription) {
      alert('Please purchase lifetime access to view notes');
      return;
    }
    
    setSelectedNote(note);
    
    // Update view count (optional)
    try {
      supabase
        .from('notes')
        .update({ downloads: note.downloads + 1 })
        .eq('id', note.id)
        .then(() => {
          // Update local state
          setNotes(notes.map(n => 
            n.id === note.id ? { ...n, downloads: n.downloads + 1 } : n
          ));
        });
    } catch (error) {
      console.error('Error updating view count:', error);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSubject('');
    setSemester(null);
    setBranch('CSE');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!hasSubscription && (
        <div className="mb-8 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Lock className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-indigo-800">Lifetime Access Required</h3>
              <div className="mt-2 text-sm text-indigo-700">
                <p>
                  Get lifetime access to all notes for just ₹99. One-time payment, unlimited access.
                  <Link to="/dashboard" className="ml-1 font-medium underline">
                    Get access now
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedNote ? (
        <div>
          <button 
            onClick={() => setSelectedNote(null)}
            className="mb-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md flex items-center"
          >
            ← Back to Notes
          </button>
          <SecureNotesViewer fileUrl={selectedNote.file_url} title={selectedNote.title} />
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Notes Library</h1>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <Filter className="h-5 w-5 mr-2 text-gray-500" />
                Filters
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label htmlFor="subject-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    id="subject-filter"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <option value="">All Subjects</option>
                    {subjects.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="semester-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Semester
                  </label>
                  <select
                    id="semester-filter"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={semester === null ? '' : semester}
                    onChange={(e) => setSemester(e.target.value ? parseInt(e.target.value) : null)}
                  >
                    <option value="">All Semesters</option>
                    {semesters.map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="branch-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Branch
                  </label>
                  <select
                    id="branch-filter"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  >
                    <option value="CSE">Computer Science Engineering (CSE)</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
              
              {(subject || semester !== null) && (
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span className="font-medium mr-2">Active filters:</span>
                  {subject && (
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs mr-2">
                      Subject: {subject}
                    </span>
                  )}
                  {semester !== null && (
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs mr-2">
                      Semester: {semester}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">No notes found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredNotes.map((note) => (
                <div key={note.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{note.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{note.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">
                        {note.subject}
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        Semester {note.semester}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        {note.branch}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{new Date(note.created_at).toLocaleDateString()}</span>
                      <span>{note.downloads} views</span>
                    </div>
                    <button
                      onClick={() => handleViewNote(note)}
                      className={`mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${hasSubscription ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                      {hasSubscription ? (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          View Notes
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Get Lifetime Access
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NotesLibrary;