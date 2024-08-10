import React, { useState } from 'react';
import { FaFilter, FaLayerGroup, FaStar, FaPlus, FaTh, FaList } from 'react-icons/fa';
import { MdArrowDropDown } from 'react-icons/md';

const SearchBar = ({ onSearch, onAdd, onToggleView, currentView }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedGroupBy, setSelectedGroupBy] = useState([]);
  const [selectedFavorites, setSelectedFavorites] = useState([]);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleCheckboxChange = (event, type) => {
    const { name, checked } = event.target;
    if (type === 'filters') {
      setSelectedFilters(checked ? [...selectedFilters, name] : selectedFilters.filter((item) => item !== name));
    } else if (type === 'groupBy') {
      setSelectedGroupBy(checked ? [...selectedGroupBy, name] : selectedGroupBy.filter((item) => item !== name));
    } else if (type === 'favorites') {
      setSelectedFavorites(checked ? [...selectedFavorites, name] : selectedFavorites.filter((item) => item !== name));
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4">
      <div className="flex items-center mb-1">
        <input
          type="text"
          placeholder="Search term..."
          className="flex-grow md:w-full px-2 py-1 text-xs rounded-md focus:outline-none border border-r-0 border-gray-300"
        />
        <button
          className="bg-customPurple text-xs hover:bg-hcolor text-white px-2 py-1  rounded-r-md flex items-center space-x-1 border-l-0"
          onClick={onSearch}
        >
          Search
        </button>
      </div>
      <div className='md:flex space-y-1 justify-between md:gap-16 items-center'>
        <div className="flex items-center  relative border rounded-md">
          <div className="flex items-center space-x-1 text-xs uppercase p-1 border-r-2 text-gray-700 hover:bg-gray-100 hover:text-black cursor-pointer" onClick={() => toggleDropdown('filters')}>
            <FaFilter className='h-3' />
            <span>Filters</span>
            <MdArrowDropDown />
          </div>
          {openDropdown === 'filters' && (
            <div className="absolute top-12 left-0 bg-white text-black shadow-lg rounded-md p-1 z-10">
              {['Filter 1', 'Filter 2', 'Filter 3'].map((filter) => (
                <label key={filter} className="block px-4 py-2 hover:bg-gray-200">
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
          <div className="flex items-center p-1 space-x-1 text-xs uppercase hover:bg-gray-100 border-r-2 text-gray-700 hover:text-black cursor-pointer" onClick={() => toggleDropdown('groupBy')}>
            <FaLayerGroup className='h-3' />
            <span>Group By</span>
            <MdArrowDropDown />
          </div>
          {openDropdown === 'groupBy' && (
            <div className="absolute top-12 left-16 bg-white text-black shadow-lg rounded-md p-2 z-10">
              {['Group By 1', 'Group By 2', 'Group By 3'].map((group) => (
                <label key={group} className="block px-4 py-2 hover:bg-gray-200">
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
          <div className="flex items-center space-x-1 text-xs hover:bg-gray-100 uppercase  p-1 text-gray-700 hover:text-black cursor-pointer" onClick={() => toggleDropdown('favorites')}>
            <FaStar className='h-3' />
            <span>Favorites</span>
            <MdArrowDropDown />
          </div>
          {openDropdown === 'favorites' && (
            <div className="absolute top-12 left-32 bg-white text-black shadow-lg rounded-md p-2 z-10">
              {['Favorite 1', 'Favorite 2', 'Favorite 3'].map((favorite) => (
                <label key={favorite} className="block px-4 py-2 hover:bg-gray-200">
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
        <div className="flex items-center md:ml-2 space-x-0">
          <div className="flex items-center border border-l-0 rounded-r-md">
            <button className="bg-red-500 text-white text-xs uppercase px-2 py-1 rounded-l-md hover:bg-red-600 flex items-center space-x-1 border-r-0" onClick={onAdd}>
              <FaPlus className='h-3' />
              <span>Add</span>
            </button>
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
      </div>
    </div>
  );
};

export default SearchBar;
