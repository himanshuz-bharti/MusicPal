import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { FolderPlus, X } from 'lucide-react';
import { useMusicStore } from '../stores/useMusicStore';
import type { Song, Album } from '../types';

interface AddToAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: Song | null;
}

const AddToAlbumModal: React.FC<AddToAlbumModalProps> = ({ isOpen, onClose, currentSong }) => {
  const [selectedAlbums, setSelectedAlbums] = useState<string[]>([]);
  const [loadingAddToAlbum, setLoadingAddToAlbum] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [albumstoShow, setalbumstoShow] = useState<Album[]>([]);
  
  const modalRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const albumNameInputRef = useRef<HTMLInputElement | null>(null);
  
  const { fetchAlbums, albums, addSongtoAlbum, createAlbum } = useMusicStore();

  useEffect(() => {
    if (isOpen) {
      fetchAlbums();
      setSelectedAlbums([]);
      setNewAlbumName(''); // Reset form when modal opens
      setImageFile(null);
    }
  }, [isOpen, fetchAlbums]);

  useEffect(() => {
    if (!currentSong) return;
    const filteralbums = albums.filter((album) => !(album.songs.some((song) => song._id === currentSong?._id)));
    setalbumstoShow(filteralbums);
  }, [albums.length, currentSong?._id]);

  // Handle focus and scroll lock
useEffect(() => {
  if (!isOpen) return;

  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  // Focus the album name input instead of the modal container
  setTimeout(() => {
    albumNameInputRef.current?.focus();
  }, 100);

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };
  document.addEventListener('keydown', handleKeydown);

  return () => {
    document.body.style.overflow = previousOverflow;
    document.removeEventListener('keydown', handleKeydown);
  };
}, [isOpen, onClose]);

  const handleAlbumToggle = (albumId: string) => {
    setSelectedAlbums(prev => 
      prev.includes(albumId) 
        ? prev.filter(id => id !== albumId)
        : [...prev, albumId]
    );
  };

  const handleConfirmAddToAlbum = async () => {
    if (!currentSong?._id || selectedAlbums.length === 0) return;
    
    setLoadingAddToAlbum(true);
    try {
      for (const albumId of selectedAlbums) {
        await addSongtoAlbum(currentSong._id, albumId);
      }
      onClose();
      setSelectedAlbums([]);
    } catch (error) {
      console.error('Error adding song to albums:', error);
    } finally {
      setLoadingAddToAlbum(false);
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Fixed input change handler
  const handleAlbumNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAlbumName(e.target.value);
  };

  const handleCreateNewAlbum = async () => {
    if (!newAlbumName.trim() || !imageFile || !currentSong?._id) return;
    
    try {
      const res = await createAlbum(newAlbumName.trim(), imageFile, currentSong._id);
      console.log('Creating new album:', newAlbumName, imageFile);
      
      // Reset form after successful creation
      setNewAlbumName('');
      setImageFile(null);
      onClose();
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Refresh albums list
      await fetchAlbums();
    } catch (error) {
      console.error('Error creating new album:', error);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-md"
        onClick={onClose}
      />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-to-album-title"
        tabIndex={-1}
        className="relative bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col border border-gray-700 z-10 overflow-hidden mx-4"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 id="add-to-album-title" className="text-xl font-bold text-white">Add to Album</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Album List */}
        <div className="flex-1 overflow-y-auto p-6">
          {albumstoShow && albumstoShow.length > 0 ? (
            <div className="space-y-4">
              {albumstoShow.map((album: any) => (
                <label
                  key={album._id}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-800 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-600"
                >
                  <input
                    type="checkbox"
                    checked={selectedAlbums.includes(album._id)}
                    onChange={() => handleAlbumToggle(album._id)}
                    className="w-5 h-5 text-green-500 bg-gray-700 border-gray-500 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                  />
                  <img
                    src={album.imageUrl || '/default-album.png'}
                    alt={album.name}
                    className="w-12 h-12 rounded-lg object-cover shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-base font-medium truncate">
                      {album.name}
                    </p>
                    <p className="text-gray-400 text-sm truncate">
                      {album.songs.length || 0} songs
                    </p>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-2">
                <FolderPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
              </div>
              <p className="text-gray-400 text-lg">No albums found</p>
              <p className="text-gray-500 text-sm">Create an album first to add songs</p>
            </div>
          )}
          
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="space-y-3">
              {/* Album Name Input */}
              <div className="flex items-center space-x-3">
                <input
                  ref={albumNameInputRef}
                  type="text"
                  placeholder="Enter album name"
                  value={newAlbumName}
                  onChange={handleAlbumNameChange}
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-200"
                  autoComplete="off"
                />
              </div>
              
              {/* Image File Input */}
              <div className="flex items-center space-x-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  id="imageFile"
                  className="hidden"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setImageFile(e.target.files?.[0] ?? null)
                  }
                />
                <label
                  htmlFor="imageFile"
                  className="flex-1 px-4 py-2 bg-gray-800 text-gray-400 rounded-lg border border-gray-600 hover:border-green-500 cursor-pointer transition-all duration-200 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-opacity-50"
                >
                  <span className="text-sm">
                    {imageFile ? imageFile.name : "Choose album cover image"}
                  </span>
                </label>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                  onClick={handleClearImage}
                >
                  Clear
                </button>
              </div>
              
              {/* Create Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={!newAlbumName.trim() || !imageFile || !currentSong?._id}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 whitespace-nowrap"
                  onClick={handleCreateNewAlbum}
                >
                  Create Album
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 text-gray-300 border border-gray-600 rounded-xl hover:bg-gray-800 hover:border-gray-500 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmAddToAlbum}
              disabled={selectedAlbums.length === 0 || loadingAddToAlbum}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
            >
              {loadingAddToAlbum ? 'Adding...' : selectedAlbums.length === 0 ? 'Select Albums' : `Add to ${selectedAlbums.length} Album${selectedAlbums.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal using portal to document.body
  return ReactDOM.createPortal(modalContent, document.body);
};

export default AddToAlbumModal;