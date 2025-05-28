// import React, { useState } from 'react';
// import styled from 'styled-components';
// import { useAuth } from '../contexts/AuthContext';
// import { useWeather } from '../contexts/WeatherContext';

// const FavoritesContainer = styled.div`
//   background: white;
//   padding: 1.5rem;
//   border-radius: 12px;
//   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
//   margin-bottom: 2rem;
// `;

// const FavoritesHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 1rem;
  
//   h3 {
//     margin: 0;
//     color: #2c3e50;
//     font-size: 1.2rem;
//   }
// `;

// const AddButton = styled.button`
//   background: #28a745;
//   color: white;
//   border: none;
//   padding: 0.5rem 1rem;
//   border-radius: 6px;
//   font-size: 0.9rem;
//   cursor: pointer;
//   transition: background-color 0.2s ease;
  
//   &:hover:not(:disabled) {
//     background: #218838;
//   }
  
//   &:disabled {
//     background: #6c757d;
//     cursor: not-allowed;
//   }
// `;

// const CitiesList = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 0.5rem;
// `;

// const CityChip = styled.div`
//   background: #f8f9fa;
//   border: 1px solid #e9ecef;
//   padding: 0.5rem 1rem;
//   border-radius: 20px;
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   font-size: 0.9rem;
//   cursor: pointer;
//   transition: all 0.2s ease;
  
//   &:hover {
//     background: #e9ecef;
//     transform: translateY(-1px);
//   }
  
//   .city-name {
//     color: #495057;
//   }
  
//   .remove-btn {
//     background: #dc3545;
//     color: white;
//     border: none;
//     border-radius: 50%;
//     width: 20px;
//     height: 20px;
//     font-size: 0.7rem;
//     cursor: pointer;
//     display: flex;
//     align-items: center;
//     justify-content: center;
    
//     &:hover {
//       background: #c82333;
//     }
//   }
// `;

// const EmptyState = styled.div`
//   text-align: center;
//   color: #6c757d;
//   font-style: italic;
//   padding: 1rem;
// `;

// const ErrorMessage = styled.div`
//   color: #dc3545;
//   font-size: 0.9rem;
//   margin-top: 0.5rem;
//   padding: 0.5rem;
//   background: #f8d7da;
//   border: 1px solid #f5c6cb;
//   border-radius: 4px;
// `;

// const SuccessMessage = styled.div`
//   color: #155724;
//   font-size: 0.9rem;
//   margin-top: 0.5rem;
//   padding: 0.5rem;
//   background: #d4edda;
//   border: 1px solid #c3e6cb;
//   border-radius: 4px;
// `;

// const FavoriteCities: React.FC = () => {
//   const { user, profile, addFavoriteCity, removeFavoriteCity } = useAuth();
//   const { searchWeather, currentWeather } = useWeather();
//   const [isAdding, setIsAdding] = useState(false);
//   const [isRemoving, setIsRemoving] = useState<string | null>(null);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   if (!user) return null;

//   const favoriteCities = profile?.favorite_cities || [];
//   const currentCity = currentWeather?.name;

//   const clearMessages = () => {
//     setError('');
//     setSuccess('');
//   };

//   const handleAddCurrent = async () => {
//     if (!currentCity || favoriteCities.includes(currentCity)) return;

//     setIsAdding(true);
//     clearMessages();

//     try {
//       await addFavoriteCity(currentCity);
//       setSuccess(`${currentCity} added to favorites!`);
//       // Optionally: fetch updated profile here if needed

//       // Clear success message after 3 seconds
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (error) {
//       console.error('Error adding favorite city:', error);
//       setError('Failed to add city to favorites. Please try again.');
//     } finally {
//       setIsAdding(false);
//     }
//   };

//   const handleRemoveCity = async (city: string) => {
//     setIsRemoving(city);
//     clearMessages();

//     try {
//       await removeFavoriteCity(city);
//       await removeFavoriteCity(city);
//       setSuccess(`${city} removed from favorites!`);
//       // Optionally: fetch updated profile here if needed

//       // Clear success message after 3 seconds
//       setTimeout(() => setSuccess(''), 3000);
//       console.error('Error removing favorite city:', error);
//       setError('Failed to remove city from favorites. Please try again.');
//     } finally {
//       setIsRemoving(null);
//     }
//   };

//   const handleCityClick = (city: string) => {
//     clearMessages();
//     searchWeather(city);
//   };

//   return (
//     <FavoritesContainer>
//       <FavoritesHeader>
//         <h3>Favorite Cities</h3>
//         {currentCity && !favoriteCities.includes(currentCity) && (
//           <AddButton
//             onClick={handleAddCurrent}
//             disabled={isAdding}
//           >
//             {isAdding ? 'Adding...' : `Add ${currentCity}`}
//           </AddButton>
//         )}
//       </FavoritesHeader>

//       {error && <ErrorMessage>{error}</ErrorMessage>}
//       {success && <SuccessMessage>{success}</SuccessMessage>}

//       {favoriteCities.length > 0 ? (
//         <CitiesList>
//           {favoriteCities.map((city) => (
//             <CityChip key={city}>
//               <span
//                 className="city-name"
//                 onClick={() => handleCityClick(city)}
//               >
//                 {city}
//               </span>
//               <button
//                 className="remove-btn"
//                 onClick={() => handleRemoveCity(city)}
//                 disabled={isRemoving === city}
//                 aria-label={`Remove ${city} from favorites`}
//               >
//                 {isRemoving === city ? '...' : '×'}
//               </button>
//             </CityChip>
//           ))}
//         </CitiesList>
//       ) : (
//         <EmptyState>
//           No favorite cities yet. Search for a city and add it to your favorites!
//         </EmptyState>
//       )}
//     </FavoritesContainer>
//   );
// };

// export default FavoriteCities;
