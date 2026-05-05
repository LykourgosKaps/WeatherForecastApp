
import React, { useCallback, useEffect, useState} from "react";
import {Grid} from '@material-ui/core'
import {Map} from './Map'
import {SelectMultiple} from './SelectMultiple'
import { HAZARDTYPES, PROBABILITY, MAGNITUDE } from "./options";

const data = {'18': [
                    {'type': 'Flood and sea level rise > River flood', 'probability': 'Medium', 'magnitude': 'Medium'}, 
                    {'type': 'Storm and wind > Storm surge', 'probability': 'Medium', 'magnitude': 'Medium'}, 
                    {'type': 'Extreme hot temperature > Heat wave', 'probability': 'Medium', 'magnitude': 'Medium'}, 
                    {'type': 'Extreme Precipitation > Rain storm', 'probability': 'High', 'magnitude': 'High'}
                    ], 
              '159': [
                    {'type': 'Biological hazards > Vector-borne disease', 'probability': 'Medium Low', 'magnitude': 'High'}, 
                    {'type': 'Wild fire > Forest fire', 'probability': 'Low', 'magnitude': 'Medium'}, 
                    {'type': 'Extreme cold temperature > Cold wave', 'probability': 'Medium Low', 'magnitude': 'Medium'}, 
                    {'type': 'Storm and wind > Severe wind', 'probability': 'Medium', 'magnitude': 'Medium High'}, 
                    {'type': 'Mass movement > Subsidence', 'probability': 'Medium', 'magnitude': 'Medium Low'}, 
                    {'type': 'Extreme cold temperature > Extreme cold days', 'probability': 'Medium Low', 'magnitude': 'Medium High'}, 
                    {'type': 'Flood and sea level rise > River flood', 'probability': 'Medium', 'magnitude': 'Medium'}, 
                    {'type': 'Extreme Precipitation > Rain storm', 'probability': 'Medium', 'magnitude': 'Medium High'}, 
                    {'type': 'Water Scarcity > Drought', 'probability': 'Medium High', 'magnitude': 'High'}, 
                    {'type': 'Extreme hot temperature > Extreme hot days', 'probability': 'Medium High', 'magnitude': 'High'}, 
                    {'type': 'Extreme hot temperature > Heat wave', 'probability': 'High', 'magnitude': 'High'}], 
              '163': [
                    {'type': 'Flood and sea level rise > Flash / surface flood', 'probability': 'High', 'magnitude': 'High'}, 
                    {'type': 'Extreme hot temperature > Heat wave', 'probability': 'High', 'magnitude': 'High'}, 
                    {'type': 'Extreme hot temperature > Extreme hot days', 'probability': 'High', 'magnitude': 'High'}
                    ], 
            }
const cities_coordinates = {'18':  {'lat': 55.67613, 'lng': 12.56571},
                            '159': {'lat': 48.8787676, 'lng': 2.3222643},
                            '163': {'lat': 50.8705213, 'lng': 7.069748}
                            }


export default function App() {
    const [typeFilters, setTypeFilters] = useState([])
    const [magnitudeFilters, setMagnitudeFilters] = useState([])
    const [probabilityFilters, setProbabilityFilters] = useState([])
    const [filtered_cities, setFilteredCities] = useState([])



    const applyFilters = useCallback(() => {
        if (typeFilters.length === 0 || magnitudeFilters.length === 0 || probabilityFilters.length === 0) {
            console.log("Skipping applyFilters as not all filters are selected.");
            return;
        }

        console.log("Current Filters State:", { typeFilters, magnitudeFilters, probabilityFilters });

        const newFilteredCities = Object.keys(data).filter(cityID =>
            data[cityID].some(hazard =>
                typeFilters.includes(hazard.type) &&
                magnitudeFilters.includes(hazard.magnitude) &&
                probabilityFilters.includes(hazard.probability)
            )
        );

        /*const typeMatches = typeFilters.includes(hazard.type);
         const magnitudeMatches = magnitudeFilters.length === 0 || magnitudeFilters.includes(hazard.magnitude);
         const probabilityMatches = probabilityFilters.length === 0 || probabilityFilters.includes(hazard.probability); */

        const CitiesWithCoordinates = newFilteredCities
            .map(cityID => ({
                id: cityID,
                coordinates: cities_coordinates[cityID], // make sure this pulls valid coordinates
            }))
            .filter(city => city.coordinates); // only keep cities with coordinates

        console.log("Filtered Cities with Coordinates:", CitiesWithCoordinates);
        CitiesWithCoordinates.forEach(city => console.log(`City ID: ${city.id}, Coordinates:`, city.coordinates));
        setFilteredCities(CitiesWithCoordinates);
    }, [typeFilters, probabilityFilters, magnitudeFilters]);





    /*const GROUP = useMemo(() => ({ //If GROUP needs to be accessible outside of useEffect, use a useMemo hook.
        'HAZARD': 'hazard',        // useMemo will only recalculate GROUP when data changes (assuming data is what GROUP relies on)

        newFilteredCitiesByHazard: [], //if i call outside the GROUP an array it will print me undefined because GROUP is an object which could have functions such as runLoop
        //so i have to create an array which will be the associated property of the group

        runLoop: function () { //because Group is an object and not an array we cannot declare let i=0

            // Outer loop to go through each key
            for (let i = 0; i < Object.keys(data).length; i++) {
                const currentKey = Object.keys(data)[i]; // Get the current key

                // Inner loop starts from the next key to avoid duplication
                for (let j = i + 1; j < Object.keys(data).length; j++) {
                    const nextKey = Object.keys(data)[j];

                    const currentHazards = data[currentKey].map(hazard => hazard.type);
                    const nextHazards = data[nextKey].map(hazard => hazard.type);

                    const commonHazards = currentHazards.filter(hazard => nextHazards.includes(hazard));
                    if (commonHazards.length > 0) {
                        commonHazards.forEach(hazard => {
                            this.newFilteredCitiesByHazard.push(`currentKey: ${currentKey}, Value: ${hazard} -- nextKey: ${nextKey}, Value: ${hazard}`)
                        })
                    } else {
                        continue;
                    }
                    // if (currentHazards.some(hazard => nextHazards.includes(hazard))) {//.some checks if nextHazard contains the hazard of the currentHazard
                    //   this.newFilteredCitiesByHazard.push(currentKey, currentHazards, nextKey, nextHazards);
                    // }
                }
            }
        }
    }), []);*/

    useEffect(() => {
        applyFilters();
       // GROUP.runLoop();
    }, [typeFilters, magnitudeFilters, probabilityFilters, applyFilters]);


    return (
        <Grid container>
            <Grid item lg={2}>
                <SelectMultiple filterType={"Hazard Filter"} filterOptions={HAZARDTYPES} filters={typeFilters} setFilters={setTypeFilters} applyFilters={applyFilters} /> 
            </Grid>                                                                                        
            <Grid item lg={2}>
                <SelectMultiple filterType={"Probability Filter"} filterOptions={PROBABILITY} filters={probabilityFilters} setFilters={setProbabilityFilters} applyFilters={applyFilters} />
            </Grid>
            <Grid item lg={2}>
                <SelectMultiple filterType={"Magnitude Filter"} filterOptions={MAGNITUDE} filters={magnitudeFilters} setFilters={setMagnitudeFilters} applyFilters={applyFilters} />
            </Grid>
            <Grid item lg={12}>
                <Map data={filtered_cities} coordinates={cities_coordinates}/>
            </Grid>
        </Grid>
    );
}
