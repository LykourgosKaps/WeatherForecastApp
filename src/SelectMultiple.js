import React, {useEffect, useState} from 'react';
import {OutlinedInput, 
  InputLabel, 
  MenuItem, 
  FormControl, 
  ListItemText,
  Select,
  Checkbox,
} from '@material-ui/core';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 400,
    },
  },
};

export function SelectMultiple({ filterType, filterOptions, filters, setFilters, group, applyFilters }) {
    const activeFilters = filters.map((filter, i) => filter.name); // activeFilters = ['climate_hazard_type', 'magnitude', 'probability']
    const [checked, setChecked] = useState(filters)   //checked: Keeps track of which filters have been checked (selected). 
                                              // setChecked is used to dynamically add or remove selected filters as the user interacts with the UI.
                                               // []: It's initialized to an empty array because, at the beginning, no filters are selected.
                                               //As the user interacts with the filters(e.g., selecting "magnitude" or "climate_hazard_type"), you’ll add or remove these from the checked array.

    
    useEffect(() => {
        setChecked(filters); // Sync local checked state with the filters props whenver filters change
    }, [filters]);

    
    const handleChange = (type) => {
        const newChecked = checked.includes(type)
            ? checked.filter((item) => item !== type)  // Remove if already checked
            : [...checked, type];                      // Add if not checked , [...] is the way to include all the existing elements in checked and then we add type as a new element at the end of this array.

        setChecked(newChecked);                        // Update local checked state
        setFilters(newChecked);                        // Update the corresponding filter state in App.js
        console.log(`Updated ${filterType} Filters:`, newChecked);
    };

  return (
    <div style={{margin: '20px 20px 20px 0'}}>
      <FormControl fullWidth>
        <InputLabel style={{paddingLeft: 10}}>{ filterType }</InputLabel>
        <Select
          multiple
                  onClose={applyFilters}
                  value={checked}
          input={<OutlinedInput label={ filterType } />}
          renderValue={(selected) => selected.join(`, `)} //display selected items with comma
          MenuProps={MenuProps}
        >
          {filterOptions.map((type) => (
            <MenuItem key={type} value={type}>
                  <Checkbox
                      checked={activeFilters.includes(type)}
                      onChange={() => handleChange(type)} />
              <ListItemText primary={type} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}