import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User, UserPreferences } from "@/types";
import { RootState } from "@/src/store";
import { Select, DatePicker } from "antd";

// Import your slices
import { fetchSources } from "@/src/store/source/sourceSlice";
import { fetchCategories } from "@/src/store/category/categorySlice";
import { fetchAuthors } from "@/src/store/author/authorSlice";
import moment from "moment";

const { RangePicker } = DatePicker;

interface PreferenceCenterProps {
  user: User | null;
  preferences: UserPreferences & { fromDate?: string; toDate?: string };
  onSave: () => void;
  onClose: () => void;
  onApplyFilter?: () => void;
  setUserPrefs: () => void;
}

const PreferenceCenter: React.FC<PreferenceCenterProps> = ({
  user,
  preferences,
  onSave,
  onClose,
  onApplyFilter,
  setUserPrefs,
}) => {
  const dispatch = useDispatch();

  const { sources: sourceList } = useSelector(
    (state: RootState) => state.sources,
  );
  const { categories: categoryList } = useSelector(
    (state: RootState) => state.categories,
  );
  const { authors: authorList } = useSelector(
    (state: RootState) => state.authors,
  );

  const [tempPrefs, setTempPrefs] = useState<
    UserPreferences & { fromDate?: string; toDate?: string }
  >(user?.preferences || preferences);

  useEffect(() => {
    dispatch(fetchSources());
    dispatch(fetchCategories());
    dispatch(fetchAuthors());
  }, [dispatch]);

  const handleButtonClick = () => {
    setUserPrefs(tempPrefs);
    if (user) {
      onSave(tempPrefs);
    } else if (onApplyFilter) {
      onApplyFilter(tempPrefs);
      onClose();
    } else {
      onClose();
    }
  };

  const handleClearFilters = () => {
    const clearedPrefs = {
      sources: [],
      categories: [],
      authors: [],
      fromDate: "",
      toDate: "",
    };
    setTempPrefs(clearedPrefs);
    setUserPrefs(clearedPrefs);
    if (user) onSave(clearedPrefs);
    else if (onApplyFilter) {
      onApplyFilter(clearedPrefs);
      onClose();
    } else onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            Personalize Your Feed
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <i className="fa-solid fa-xmark text-gray-500"></i>
          </button>
        </div>

        {/* Body */}
        <div className="flex-grow overflow-y-auto p-6 space-y-8">
          {/* Date Range */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
              Date Range
            </h3>
            <RangePicker
              className="w-full"
              value={
                tempPrefs.fromDate && tempPrefs.toDate
                  ? [moment(tempPrefs.fromDate), moment(tempPrefs.toDate)]
                  : undefined
              }
              onChange={(dates, dateStrings) =>
                setTempPrefs((prev) => ({
                  ...prev,
                  fromDate: dateStrings[0],
                  toDate: dateStrings[1],
                }))
              }
              style={{ height: 40 }}
            />
          </div>

          {/* Sources */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
              News Sources
            </h3>
            <Select
              mode="multiple"
              allowClear
              showSearch
              placeholder="Select sources"
              value={tempPrefs.sources}
              onChange={(values) =>
                setTempPrefs((prev) => ({ ...prev, sources: values }))
              }
              options={sourceList.map((s) => ({ label: s.name, value: s.id }))}
              className="w-full"
              optionFilterProp="label"
              getPopupContainer={(node) => node.parentNode}
              style={{ height: 40 }}
              popupMatchSelectWidth={true}
            />
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
              Categories
            </h3>
            <Select
              mode="multiple"
              allowClear
              showSearch
              placeholder="Select categories"
              value={tempPrefs.categories}
              onChange={(values) =>
                setTempPrefs((prev) => ({ ...prev, categories: values }))
              }
              options={categoryList.map((c) => ({
                label: c.name,
                value: c.id,
              }))}
              className="w-full"
              optionFilterProp="label"
              style={{ minHeight: 40 }}
              getPopupContainer={(node) => node.parentNode}
              popupMatchSelectWidth={true}
            />
          </div>

          {/* Authors */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
              Authors
            </h3>
            <Select
              mode="multiple"
              allowClear
              showSearch
              placeholder="Select authors"
              value={tempPrefs.authors}
              onChange={(values) =>
                setTempPrefs((prev) => ({ ...prev, authors: values }))
              }
              options={authorList.map((a) => ({ label: a.name, value: a.id }))}
              className="w-full"
              optionFilterProp="label"
              getPopupContainer={(node) => node.parentNode}
              style={{ minHeight: 40 }}
              popupMatchSelectWidth={true}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleButtonClick}
            className="flex-1 py-4 rounded-2xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xl"
          >
            {user ? "Save Preferences" : "Apply Filter"}
          </button>
          <button
            onClick={handleClearFilters}
            className="flex-1 py-4 rounded-2xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferenceCenter;
