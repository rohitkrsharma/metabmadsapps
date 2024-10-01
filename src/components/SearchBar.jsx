import React, { useState, useRef, useEffect } from 'react';
import { FaFilter, FaLayerGroup, FaStar, FaPlus, FaTh, FaList } from 'react-icons/fa';
import { MdArrowDropDown } from 'react-icons/md';

const SearchBar = ({
  onSearchTermChange,
  onAdd,
  onToggleView,
  currentView,
  showAddAndView,
  searchPlaceholder = "Search...",
  filterOptions = [],
  groupByOptions = [],
  favoritesOptions = [],
  onFilterChange,
  onGroupByChange,
  onFavoritesChange
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedGroupBy, setSelectedGroupBy] = useState([]);
  const [selectedFavorites, setSelectedFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleCheckboxChange = (event, type) => {
    const { name, checked } = event.target;
    if (type === 'filters') {
      const updatedFilters = checked
        ? [...selectedFilters, name]
        : selectedFilters.filter((item) => item !== name);
      setSelectedFilters(updatedFilters);
      onFilterChange(updatedFilters); // Trigger callback to parent component
    } else if (type === 'groupBy') {
      const updatedGroupBy = checked
        ? [...selectedGroupBy, name]
        : selectedGroupBy.filter((item) => item !== name);
      setSelectedGroupBy(updatedGroupBy);
      onGroupByChange(updatedGroupBy); // Trigger callback to parent component
    } else if (type === 'favorites') {
      const updatedFavorites = checked
        ? [...selectedFavorites, name]
        : selectedFavorites.filter((item) => item !== name);
      setSelectedFavorites(updatedFavorites);
      onFavoritesChange(updatedFavorites); // Trigger callback to parent component
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    onSearchTermChange(event.target.value);
  };
  return (
    <div className="bg-white shadow-md rounded-md p-4 relative" ref={dropdownRef}>
      {/* Search Input */}
      <div className="flex items-center mb-2">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-grow px-3 py-2 text-sm rounded-l-md focus:outline-none border border-gray-300"
        />
        <button
          className="bg-customPurple text-sm hover:bg-hcolor text-white px-4 py-2 rounded-r-md flex items-center space-x-1 border-l-0"
          onClick={() => { /* Implement search functionality if needed */ }}
        >
          Search
        </button>
      </div>

      {/* Dropdowns and Actions */}
      <div className="flex justify-between items-center">
        {/* Dropdowns */}
        <div className="flex items-center  relative border rounded-md">
          {/* Filters Dropdown */}
          {filterOptions.length > 0 && (
            <div className="relative">
              <button
                className="flex items-center space-x-1 text-xs uppercase p-1 border-r-2 text-gray-700 hover:bg-gray-100 hover:text-black cursor-pointer"
                onClick={() => toggleDropdown('filters')}
              >
                <FaFilter className="h-3" />
                <span>Filters</span>
                <MdArrowDropDown />
              </button>
              {openDropdown === 'filters' && (
                <div className="absolute top-12 left-0 bg-white text-black shadow-lg rounded-md p-1 z-10">
                  {filterOptions.map((filter) => (
                    <label key={filter} className="flex items-center px-4 py-2 hover:bg-gray-200">
                      <input
                        type="checkbox"
                        name={filter}
                        checked={selectedFilters.includes(filter)}
                        onChange={(e) => handleCheckboxChange(e, 'filters')}
                        className="mr-2"
                      />
                      {filter}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Group By Dropdown */}
          {groupByOptions.length > 0 && (
            <div className="relative">
              <button
                className="flex items-center p-1 space-x-1 text-xs uppercase hover:bg-gray-100 border-r-2 text-gray-700 hover:text-black cursor-pointer"
                onClick={() => toggleDropdown('groupBy')}
              >
                <FaLayerGroup className="h-3" />
                <span>Group By</span>
                <MdArrowDropDown />
              </button>
              {openDropdown === 'groupBy' && (
                <div className="absolute top-12 left-0 bg-white text-black shadow-lg rounded-md p-1 z-10">
                  {groupByOptions.map((group) => (
                    <label key={group} className="flex items-center px-4 py-2 hover:bg-gray-200">
                      <input
                        type="checkbox"
                        name={group}
                        checked={selectedGroupBy.includes(group)}
                        onChange={(e) => handleCheckboxChange(e, 'groupBy')}
                        className="mr-2"
                      />
                      {group}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Favorites Dropdown */}
          {favoritesOptions.length > 0 && (
            <div className="relative">
              <button
                className="flex items-center p-1 space-x-1 text-xs uppercase hover:bg-gray-100 text-gray-700 hover:text-black cursor-pointer"
                onClick={() => toggleDropdown('favorites')}
              >
                <FaStar className="h-3" />
                <span>Favorites</span>
                <MdArrowDropDown />
              </button>
              {openDropdown === 'favorites' && (
                <div className="absolute top-12 left-0 bg-white text-black shadow-lg rounded-md p-1 z-10">
                  {favoritesOptions.map((favorite) => (
                    <label key={favorite} className="flex items-center px-4 py-2 hover:bg-gray-200">
                      <input
                        type="checkbox"
                        name={favorite}
                        checked={selectedFavorites.includes(favorite)}
                        onChange={(e) => handleCheckboxChange(e, 'favorites')}
                        className="mr-2"
                      />
                      {favorite}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add and View Buttons */}
        {showAddAndView && (
          <div className="flex items-center ml-2 space-x-0">
            <button className="bg-red-500 text-white text-xs uppercase px-2 py-1 rounded-l-md hover:bg-red-600 flex items-center space-x-1 border-r-0" onClick={onAdd}>
              <FaPlus className='h-3' />
              <span>Add</span>
            </button>
            <div className="flex items-center border border-l-0 rounded-r-md">
              <div className='border-r-2 p-1 text-xs hover:bg-gray-100 '>
                <button
                  className={`flex items-center space-x-1 uppercase text-gray-700 hover:text-black ${currentView === 'grid' ? 'text-black' : ''}`}
                  onClick={() => onToggleView('grid')}
                >
                  <FaTh className='h-3' />
                  <span>Grid</span>
                </button>
              </div>
              <div className='p-1 text-xs hover:bg-gray-100'>
                <button
                  className={`flex items-center uppercase space-x-1 text-gray-700 hover:text-black ${currentView === 'list' ? 'text-black' : ''}`}
                  onClick={() => onToggleView('list')}
                >
                  <FaList className='h-3' />
                  <span>List</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
