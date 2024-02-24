import { View, Text, Image } from 'react-native'
import React from 'react'
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome"
// import { useDispatch } from 'react-redux'
// import { logoutUser } from '../../redux/features/authSlice'


interface headerBarProps{
    logo:boolean,
    name:string,
    help:boolean,
    search:boolean,
}

const HeaderBar = ({logo,name,help,search}:headerBarProps) => {
    // const logoutDispatch = useDispatch();

    const handleLogout=()=>{
        // logoutDispatch(logoutUser())
    }
  return (
    <View className='w-full flex-row bg-white px-5 py-2 justify-between items-center'>
    <View className='flex flex-row justify-center items-center'>
    {
        logo && <Image source={{uri:'https://res.cloudinary.com/drxhgcqvw/image/upload/v1705428150/ysxh4cpuke6va2sqhou8.png'}} className='h-8 w-8 rounded-lg' resizeMode={'cover'}/>

    }
    {
        name.length>3 && <Text className=" text-gray-700 px-2 py-1 text-lg font-['Montserrat-Bold']">{name}</Text>

    }
    </View>
    {
        help && <Text className="inline-block rounded-full text-black border px-3 py-1.5 text-md items-center justify-center  font-['Montserrat-Medium']" onPress={handleLogout}> <FontAwesomeIcon name="phone" color={"#000000"} size={15} /> Help?</Text>
    }
    {
        search && <Text className="inline-block rounded-full text-black border px-3 py-1.5 text-md items-center justify-center  font-['Montserrat-Medium']"> <FontAwesomeIcon name="search" color={"#000000"} size={15} /> Search</Text>

    }
    </View>
  )
}

export default HeaderBar