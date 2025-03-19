import Image from "next/image";
import React, { useState, KeyboardEvent, ChangeEvent, useEffect } from "react";

interface TagInputProps {
  customClasses: {};
  onTagAdded: (tag: Tag) => void;
  tagType: string;
  tags?: Tag[];
}

export interface Tag {
  text: string;
  type: string;
}

const TagInput: React.FC<TagInputProps> = ({
  customClasses,
  onTagAdded,
  tagType,
  tags,

}) => {
  const [tagsState, setTagsState] = useState<Tag[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    if (tags) {
      setTagsState(tags);
    }
  }, [tags]);

  const [selectedTagText, setSelectedTagText] = useState<string>("");

  /**
 * Adds a new tag to the tags state and clears the input fields.
 *
 * This function checks if the input value is not empty. If it's not,
 * it creates a new tag object with the current input value and tag type,
 * then updates the tags state by adding this new tag. It also clears
 * the input value and selected tag text fields. Finally, it calls
 * the `onTagAdded` callback with the new tag.
 */
  const addTag = () => {
    if (inputValue.trim() === "") return;
    const newTag: Tag = { text: inputValue, type: tagType };
    setTagsState([...tagsState, newTag]);
    setInputValue("");
    setSelectedTagText("");
    onTagAdded(newTag);
  };

  /**
 * Removes a tag from the tags state at a specified index and updates the input fields.
 *
 * This function takes an index as an argument, creates a copy of the current tags state,
 * and removes the tag at the specified index from this copy. It then updates the tags state
 * with the modified array. If there are remaining tags after removal, it sets the input value
 * and selected tag text to the text of the last remaining tag. If no tags are left,
 * it clears the input value and selected tag text fields.
 *
 * @param index - The index of the tag to be removed.
 */
  const removeTag = (index: number) => {
    const updatedTags = [...tagsState];
    updatedTags.splice(index, 1);
    setTagsState(updatedTags);
    if (updatedTags.length > 0) {
      setInputValue(updatedTags[updatedTags.length - 1].text);
      setSelectedTagText(updatedTags[updatedTags.length - 1].text);
    } else {
      setInputValue("");
      setSelectedTagText("");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTag();
    }
  };

  const handleTagClick = (tag: Tag) => {
    setSelectedTagText(tag.text);
  };

  return (
    <div className="relative">
      <div className="absolute z-10 ml-2 mt-5">
        <Image src="/assets/icons/tags.svg" alt="tag" width={20} height={20} />
      </div>
      <input
        type="text"
        placeholder="add Keyword"
        className={`${customClasses} relative cursor-pointer border rounded-md p-2 pl-8 mt-2`}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
      />

      <div className="flex mt-2 flex-wrap gap-2">
        <>
          {tagsState?.map((tag, index) => (
            <div
              key={index}
              onClick={() => handleTagClick(tag)}
              className="input-tag-style cursor-pointer px-1 py-1 rounded-full flex items-center"
            >
              <span className="mr-1">{tag.text}</span>
              <button
                type="button"
                className="focus:outline-none"
                onClick={() => {
                  removeTag(index);
                }}
              >
                <div className="bg-transparent mt-1">
                  <Image
                    src="/assets/icons/Vector.svg"
                    alt="tag"
                    width={10}
                    height={10}
                    className="cursor-pointer"
                  />
                </div>
              </button>
            </div>
          ))}
        </>
      </div>
    </div>
  );
};

export default TagInput;
