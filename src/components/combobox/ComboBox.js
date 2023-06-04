import { useEffect, useState } from 'react'
import { Combobox } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon, FolderIcon, FolderPlusIcon, FolderOpenIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useDispatch, useSelector } from 'react-redux'
import { checkCollectionExists, getAllCollectionWithSub } from '../../utils/find-collection-id'
import { message } from 'antd';
import { addCollectionReset, addCollections, getUserCollections, saveSelectedCollection } from '../../actions/collection'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function ComboBox({ inputShown, setShowCollectionInput, collectionData, userId, setSelectedCollection, selectedCollection, error}) {
    const [query, setQuery] = useState('')
    const dispatch = useDispatch()
    const [addedCollectionStatus, setAddedCollectionStatus] =  useState(false)
    const [collections, setCollections] = useState(collectionData)
    const [isQuery, setIsQuery] = useState(false)
    const [selectedOption, setSelectedOption] = useState(()=>({id:selectedCollection?.id, name: selectedCollection?.name ? selectedCollection?.name : selectedCollection?.name}));
    const [messageApi, contextHolder] = message.useMessage();

    //set collection
    useEffect(()=>{
        if(selectedOption && selectedCollection?.id){
            setSelectedOption({id:selectedCollection?.id, name: selectedCollection?.name? selectedCollection?.name : selectedCollection?.name})
        }
        if (collectionData.length === 0) {
            dispatch(getUserCollections()).then((res) => {
                if (res.error === undefined && res.payload.error === undefined) {
                    setCollections(res.payload.data)
                }
            })
        }
    },[])
    
    const allCollections   = collectionData.length === 0 ? collections : getAllCollectionWithSub(collectionData)

    //Get collection list
    let filteredOptionData =
        query === ''
            ? (allCollections? allCollections : [])
            : allCollections?.filter((data) => {
                return data?.name?.toLowerCase().includes(query.toLowerCase())
            }) 

    

    const addedCollectionData = useSelector(state => state.collection.addedCollectionData)

    //Set selected collection
    useEffect(()=>{
        if(setShowCollectionInput && setSelectedCollection){
            setSelectedCollection(selectedOption)
            setShowCollectionInput(false)
            setAddedCollectionStatus(false)
            dispatch(saveSelectedCollection(selectedOption))
        }
    }, [selectedOption])

    //Set new added collection
    useEffect(()=>{
        if(addedCollectionData){
            filteredOptionData?.push({id: addedCollectionData.id, name: addedCollectionData.name})
            setSelectedOption({id: addedCollectionData.id, name: addedCollectionData.name})
            setAddedCollectionStatus(true)
            setIsQuery(false)
            dispatch(addCollectionReset())
        }
    },[addedCollectionData])
     
    //Add new collection
    const addCollectionHandler = async (e) => {
        if (query === "") return
        const result = checkCollectionExists(filteredOptionData,query)
        if(result){
            setQuery("")
             return ( messageApi.open({
            type: 'error',
            content: 'Collection Already Exists',
          }))}
        await dispatch(addCollections({
                        data: {
                            name: query,
                            author: userId
                        }
                    }))
        setIsQuery(false)
        setQuery("")
    }
    
    // const onCollectionFocus = () => {
    //     setSelectedOption(null)
    // }

    // const onCollectionBlur = () => {
    //     console.log("Last Option ===>", lastSelectedOption, selectedOption)
    //     if (selectedOption !== lastSelectedOption) {
    //         setSelectedOption(lastSelectedOption)
    //     }
    // }

    // const onCollectionChange = (e) => {
    //     setSelectedOption(e)
    //     setLastSelectedOption(e)
    // }

    const onCollectionChange = (e) => {
        if (typeof e === "object") {
            setSelectedOption(e)
        }
    }
            
    return (
        <>
        {contextHolder}
        <Combobox as="div" value={selectedOption} 
                  onChange={onCollectionChange}>
            <div className="ct-relative">
                <div className='ct-relative'>
                    {!isQuery ?
                        <FolderOpenIcon className="pointer-events-none absolute top-[10px] left-2 h-4 w-4 text-gray-400" aria-hidden="true" />
                        : <MagnifyingGlassIcon
                            className="pointer-events-none absolute top-[10px] left-2 h-4 w-4 text-gray-400"
                            aria-hidden="true"
                        />}
                    <Combobox.Input            
                        onKeyDown={(e) => {
                            if(e.key === "Enter"){
                                addCollectionHandler(e)
                            }
                        }}
                        className={`save-input-box w-full outline-none rounded-md border border-gray-300 bg-white pl-8 py-2 pr-6 shadow-sm text-sm ${inputShown? 'text-gray-400':''}`}
                        onChange={(event) => setQuery(event.target.value)}
                        onClick={() => setIsQuery(true)}
                        onBlur={() => setIsQuery(false)}
                        placeholder={isQuery && query === "" ? "Search or create new collection..." : query }
                        // placeholder={inputShown && !selectedOption?.id ? "Search or create new collection..." : query}
                        displayValue={(collectionData) => isQuery ? query : collectionData?.name}             
                    />

                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md pr-2 focus:outline-none">
                        {inputShown ? <ChevronUpIcon className="h-4 w-4 text-gray-400" aria-hidden="true" /> : <ChevronDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" onClick={() => setIsQuery(true)} />}
                    </Combobox.Button>
                </div>

                    {error !== true ? "":(selectedCollection && selectedCollection.id)? '' : <span className='error-label'>Please select a collection</span>}
                {(query?.length > 0 || filteredOptionData.length > 0) && (
                    <Combobox.Options static={inputShown} className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            <Combobox.Option
                            value={query}
                            className='ct-relative select-none py-2 pl-3 pr-9 cursor-pointer'>
                            <div className="flex items-center" onClick={addCollectionHandler}>
                                <FolderPlusIcon className="h-4 w-4 text-blue-500" aria-hidden="true" />
                                <span className='ml-3 truncate text-sm text-blue-500'>{`${query ? `"${query}"` : ""} Type to create new collection `}</span>
                            </div>
                        </Combobox.Option>
                        {filteredOptionData?.map((option) => (
                            <Combobox.Option
                                key={option.id}
                                value={option}
                                className='ct-relative cursor-default select-none py-2 pl-3 pr-9 text - gray - 900'>
                                {({ active, selected }) => (
                                    <>
                                        <div className="flex items-center">
                                            {selected ? <FolderOpenIcon className="h-4 w-4 text-gray-500" aria-hidden="true" /> : <FolderIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />}
                                            <span className={classNames('ml-3 truncate text-sm', selected && 'text-gray-400')}>{option.name}</span>
                                        </div>
                                        {/* {!hideCount && <span className='absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 text-sm'>
                                            {option.count}
                                        </span>} */}
                                    </>
                                )}
                            </Combobox.Option>
                        ))}
                    
                    </Combobox.Options>
                )}
            </div>
        </Combobox>
        </>
    )
}
