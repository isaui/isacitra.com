import { useRef } from 'react';
import { AiFillEdit } from 'react-icons/ai';
import UnknownAvatar from '../../../assets/unknown/unknown_avatar.svg';
import Loading from '../../../components/loading/Loading';


const ProfileSettings = ({data}) => {
   // Initial avatar file state

  const avatarInputRef = useRef(null); // Ref for the hidden input

  const handleEmailChange = (event) => {
    data.setEmail(event.target.value);
  };

  const handleUsernameChange = (event) => {
    data.setUsername(event.target.value);
  };

  const handleFirstNameChange = (event) => {
    data.setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    data.setLastName(event.target.value);
  };

  const handleBioChange = (event) => {
    data.setBio(event.target.value);
  };

  const handleAvatarChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      data.setAvatarFile(event, event.target.files[0]);
    }
  };

  

  return (
    <div className="  md:max-w-lg lg:max-w-none mx-auto p-4 text-white">
      <div className="grid lg:grid-cols-4 grid-cols-2 gap-4">
        <div className="col-span-2 lg:col-span-1">
          <div className="flex flex-col w-full h-full">
            <div className="mx-auto w-48 h-48 relative">
              <img src={data.avatarFile == ''? UnknownAvatar : data.avatarFile} alt="Profile" className="rounded-full w-48 h-48" />
              <div className="absolute flex p-2 top-3 right-0 rounded-full bg-black">
                <label htmlFor="avatarInput">
                  <AiFillEdit />
                </label>
                <input
                  type="file"
                  id="avatarInput"
                  accept="image/*"
                  ref={avatarInputRef}
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
              </div>
              {data.loading && <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 '>
                <Loading/>
              </div>}
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="mb-4">
            <label className="block md:text-lg text-sm">Username</label>
            <input
              type="text"
              value={data.username}
              onChange={handleUsernameChange}
              className="w-full bg-gray-700 md:text-base text-sm text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block md:text-lg text-sm">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={handleEmailChange}
              className="w-full bg-gray-700 md:text-base text-sm text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4 flex gap-4">
            <div className="flex-grow">
              <label className="block md:text-lg text-sm">First Name</label>
              <input
                type="text"
                value={data.firstName}
                onChange={handleFirstNameChange}
                className="w-full bg-gray-700 md:text-base text-sm text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-grow">
              <label className="block md:text-lg text-sm">Last Name</label>
              <input
                type="text"
                value={data.lastName}
                onChange={handleLastNameChange}
                className="w-full bg-gray-700  md:text-base text-sm text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block md:text-lg text-sm">Bio</label>
            <textarea
              value={data.bio}
              onChange={handleBioChange}
              className="w-full bg-gray-700 md:text-base text-sm text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-28"
            />
          </div>
          {/* Other inputs and buttons */}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
