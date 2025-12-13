// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import Churches from "@/data/churches"
// import { useEffect, useState } from "react";
// import {handleInputChange} from '@/utils/functions'

// const ProfileField = ({ label, value, field, type = 'text', isTextarea = false, isEditing, editData, setEditData }) => {
//      const [selectedArchdeaconry, setSelectedArchdeaconry] = useState('');
// const [filteredChurches, setFilteredChurches] = useState(Churches);




// const handleInputChange = (field, value) => {
//   setEditData(prev => ({
//     ...prev,
//     [field]: value
//   }));
// };


// // useEffect(()=>{
// //      // const filtered = filteredChurches.find(-archdeaconry => archdeaconry.archdeaconry ==  selectedArchdeaconry )
// //      //      setFilteredChurches(filtered)
// // }, [])


//     if (isEditing) {
//       return (
//         <div className="space-y-1">
//           <label className="block text-[15px] font-medium text-gray-700">{label}</label>
//           {isTextarea ? (
//             <textarea
//               value={editData[field] || ''}
//               onChange={(e) => handleInputChange(field, e.target.value)}
//                                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-gray-400 resize-none"
//                     style={{ '--tw-ring-color': '#091e54' }}
//               rows="3"
//             />
//           ) : field == 'archdeaconry' ?
//           (

//   <Select onValueChange={setSelectedArchdeaconry} value={selectedArchdeaconry}>
//     <SelectTrigger className="w-full border border-gray-300">
//     <SelectValue placeholder={value} />
//   </SelectTrigger>
//   {/* The rest of the Select components go here */}
//   <SelectContent>
//     {Churches.map((archdeaconry) => (
//       <SelectItem 
//         key={archdeaconry.archdeaconry} 
//         value={archdeaconry.archdeaconry} // This is the value passed to onValueChange
//       >
//         {archdeaconry.archdeaconry}
//       </SelectItem>
//     ))}
//   </SelectContent>
// </Select>



//           ) :
//            (
//             <input
//               type={type}
//               value={editData[field] || ''}
//               onChange={(e) => handleInputChange(field, e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-gray-400"
//               style={{ '--tw-ring-color': '#091e54' }}
//             />
//           )}
//         </div>
//       );
//     }

//     return (
//       <div className="space-y-1">
//         <label className="block text-[15px] text-gray-500">{label}</label>
//         <p className="text-gray-900 font-medium">{value || 'Not provided'}</p>
//       </div>
//     );
//   };



//   export default ProfileField


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Churches from "@/data/churches"
import { useEffect, useState } from "react";

const ProfileField = ({ label, value, field, type = 'text', isTextarea = false, isEditing, editData, setEditData }) => {
  const [selectedArchdeaconry, setSelectedArchdeaconry] = useState('');
  const [filteredChurches, setFilteredChurches] = useState([]);

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Filter churches when archdeaconry changes
  useEffect(() => {
    if (field === 'parish' && editData.archdeaconry) {
      const archdeaconryData = Churches.find(
        arch => arch.archdeaconry === editData.archdeaconry
      );
      setFilteredChurches(archdeaconryData ? archdeaconryData.churches : []);
    }
  }, [editData.archdeaconry, field]);

  // Initialize filtered churches on mount if archdeaconry already exists
  useEffect(() => {
    if (field === 'parish' && editData.archdeaconry) {
      const archdeaconryData = Churches.find(
        arch => arch.archdeaconry === editData.archdeaconry
      );
      setFilteredChurches(archdeaconryData ? archdeaconryData.churches : []);
    }
  }, []);

  if (isEditing) {
    return (
      <div className="space-y-1">
        <label className="block text-[15px] font-medium text-gray-700">{label}</label>
        
        {/* Gender Select Field */}
        {field === 'gender' ? (
          <Select 
            onValueChange={(value) => handleInputChange(field, value)} 
            value={editData[field] || ''}
          >
            <SelectTrigger className="w-full border border-gray-300">
              <SelectValue placeholder={value || 'Select Gender'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        )
        
        /* Archdeaconry Select Field */
        : field === 'archdeaconry' ? (
          <Select 
            onValueChange={(value) => {
              handleInputChange(field, value);
              // Reset parish when archdeaconry changes
              handleInputChange('parish', '');
            }} 
            value={editData[field] || ''}
          >
            <SelectTrigger className="w-full border border-gray-300">
              <SelectValue placeholder={value || 'Select Archdeaconry'} />
            </SelectTrigger>
            <SelectContent>
              {Churches.map((archdeaconry) => (
                <SelectItem 
                  key={archdeaconry.id} 
                  value={archdeaconry.archdeaconry}
                >
                  {archdeaconry.archdeaconry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
        
        /* Parish Select Field */
        : field === 'parish' ? (
          <Select 
            onValueChange={(value) => handleInputChange(field, value)} 
            value={editData[field] || ''}
            disabled={!editData.archdeaconry}
          >
            <SelectTrigger className="w-full border border-gray-300">
              <SelectValue 
                placeholder={
                  !editData.archdeaconry 
                    ? 'Select Archdeaconry first' 
                    : value || 'Select Parish'
                } 
              />
            </SelectTrigger>
            <SelectContent>
              {filteredChurches.length > 0 ? (
                filteredChurches.map((church) => (
                  <SelectItem 
                    key={church.id} 
                    value={church.name}
                  >
                    {church.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-churches" disabled>
                  No churches available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        )
        
        /* Textarea Field */
        : isTextarea ? (
          <textarea
            value={editData[field] || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-gray-400 resize-none"
            style={{ '--tw-ring-color': '#091e54' }}
            rows="3"
          />
        )
        
        /* Default Input Field */
        : (
          <input
            type={type}
            value={editData[field] || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-gray-400"
            style={{ '--tw-ring-color': '#091e54' }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label className="block text-[15px] text-gray-500">{label}</label>
      <p className="text-gray-900 font-medium">{value || 'Not provided'}</p>
    </div>
  );
};

export default ProfileField;