import { useCallback } from "react";

export default function useSubCategoryHandlers(subCategories, setSubCategories) {
  const handleAddSubCategory = useCallback(() => {
    setSubCategories([...subCategories, { name: "", services: [""] }]);
  }, [subCategories]);

  const handleDeleteSubCategory = useCallback((index) => {
    setSubCategories(subCategories.filter((_, i) => i !== index));
  }, [subCategories]);

  const handleAddBrand = useCallback((subIndex) => {
    console.log('subIndex :', subIndex)
    const newSubs = [...subCategories];
    newSubs[subIndex].services.push("");
    console.log('newSubs :', newSubs)
    setSubCategories(newSubs);
  }, [subCategories]);

  const handleDeleteBrand = useCallback((subIndex, brandIndex) => {
    const newSubs = [...subCategories];
    newSubs[subIndex].services = newSubs[subIndex].services.filter((_, i) => i !== brandIndex);
    setSubCategories(newSubs);
  }, [subCategories]);

  const handleSubCategoryChange = useCallback((index, value) => {
    const newSubs = [...subCategories];
    newSubs[index].name = value;
    setSubCategories(newSubs);
  }, [subCategories]);

  const handleBrandChange = useCallback((subIndex, brandIndex, value) => {
    const newSubs = [...subCategories];
    newSubs[subIndex].services[brandIndex] = value;
    setSubCategories(newSubs);
  }, [subCategories]);

  return {
    handleAddSubCategory,
    handleDeleteSubCategory,
    handleAddBrand,
    handleDeleteBrand,
    handleSubCategoryChange,
    handleBrandChange,
  };
}
