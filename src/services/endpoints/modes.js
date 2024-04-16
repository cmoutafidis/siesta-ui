import {useCallback, useContext, useState} from "react";
import axios from "axios";
import ConfigContext from '../../core/contexts/ConfigContext';
import {DECLARE, EXISTENCES, ORDERED_RELATIONS, POSITIONS} from "../../core/constants";

export const useModes = () => {

    const {config} = useContext(ConfigContext);
    const [positionPatterns, setPositionPatterns] = useState(undefined);
    const [existencePatterns, setExistencePatterns] = useState(undefined);
    const [orderedRelations, setOrderedRelations] = useState(undefined);
    const [orderedRelationsAlternate, setOrderedRelationsAlternate] = useState(undefined);
    const [orderedRelationsChain, setOrderedRelationsChain] = useState(undefined);
    const [loadingModes, setLoadingModes] = useState(null);

    const getModes = useCallback((logName, modesFilterObject, allModesSelected) => {
        setLoadingModes(true);

        const params = {
            log_database: logName,
            support: modesFilterObject.support
        }

        if (allModesSelected) {
            axios.get(config.BASE_URL + DECLARE, {params: params}).then((response) => response.data).then((resp) => {
                setPositionPatterns({
                    first: modesFilterObject.positionsTemplates.includes("first") ? resp["position patterns"]?.first : undefined,
                    last: modesFilterObject.positionsTemplates.includes("last") ? resp["position patterns"]?.last : undefined,
                });
                setExistencePatterns({
                    "existence": modesFilterObject.existencesTemplates.includes("existence") ? resp["existence patterns"]?.existence : undefined,
                    "absence": modesFilterObject.existencesTemplates.includes("absence") ? resp["existence patterns"]?.absence : undefined,
                    "exactly": modesFilterObject.existencesTemplates.includes("exactly") ? resp["existence patterns"]?.exactly : undefined,
                    "choice": modesFilterObject.existencesTemplates.includes("choice") ? resp["existence patterns"]?.choice : undefined,
                    "co-existence": modesFilterObject.existencesTemplates.includes("co-existence") ? resp["existence patterns"]["co-existence"] : undefined,
                    "not co-existence": modesFilterObject.existencesTemplates.includes("not co-existence") ? resp["existence patterns"]["not co-existence"] : undefined,
                    "exclusive choice": modesFilterObject.existencesTemplates.includes("exclusive choice") ? resp["existence patterns"]["exclusive choice"] : undefined,
                    "responded existence": modesFilterObject.existencesTemplates.includes("responded existence") ? resp["existence patterns"]["responded existence"] : undefined
                });

                setOrderedRelations({
                    mode: resp["ordered relations"]?.mode,
                    response: modesFilterObject.orderedTemplates.includes("response") ? resp["ordered relations"]?.response : undefined,
                    precedence: modesFilterObject.orderedTemplates.includes("precedence") ? resp["ordered relations"]?.precedence : undefined,
                    succession: modesFilterObject.orderedTemplates.includes("succession") ? resp["ordered relations"]?.succession : undefined,
                    notSuccession: modesFilterObject.orderedTemplates.includes("notSuccession") ? resp["ordered relations"]?.notSuccession : undefined,
                });
                setOrderedRelationsAlternate({
                    mode: resp["ordered relations alternate"]?.mode,
                    response: modesFilterObject.orderedAlternateTemplates.includes("response") ? resp["ordered relations alternate"]?.response : undefined,
                    precedence: modesFilterObject.orderedAlternateTemplates.includes("precedence") ? resp["ordered relations alternate"]?.precedence : undefined,
                    succession: modesFilterObject.orderedAlternateTemplates.includes("succession") ? resp["ordered relations alternate"]?.succession : undefined,
                    notSuccession: modesFilterObject.orderedAlternateTemplates.includes("notSuccession") ? resp["ordered relations alternate"]?.notSuccession : undefined,
                });
                setOrderedRelationsChain({
                    mode: resp["ordered relations chain"]?.mode,
                    response: modesFilterObject.orderedChainTemplates.includes("response") ? resp["ordered relations chain"]?.response : undefined,
                    precedence: modesFilterObject.orderedChainTemplates.includes("precedence") ? resp["ordered relations chain"]?.precedence : undefined,
                    succession: modesFilterObject.orderedChainTemplates.includes("succession") ? resp["ordered relations chain"]?.succession : undefined,
                    notSuccession: modesFilterObject.orderedChainTemplates.includes("notSuccession") ? resp["ordered relations chain"]?.notSuccession : undefined,
                });
                setLoadingModes(false);
            });
        } else {
            if (modesFilterObject.positionsTemplates.length > 0) {
                const positionParam = modesFilterObject.positionsTemplates.length === 1 ? modesFilterObject.positionsTemplates[0] : "both";
                axios.get(config.BASE_URL + DECLARE + POSITIONS,{params: {...params, positionParam: positionParam}}).then((response) => response.data).then((resp) => {
                    setLoadingModes(false);
                    setPositionPatterns(resp);
                });
            } else {
                setPositionPatterns(undefined);
            }

            if (modesFilterObject.existencesTemplates.length > 0) {
                const modesParam = modesFilterObject?.existencesTemplates.join(",").replace(" ", "-");
                axios.get(config.BASE_URL + DECLARE + EXISTENCES,{params: {...params, modes: modesParam}}).then((response) => response.data).then((resp) => {
                    setLoadingModes(false);
                    setExistencePatterns(resp);
                });
            } else {
                setExistencePatterns(undefined);
            }

            if (modesFilterObject.orderedTemplates.length > 0) {
                const constraintParam = modesFilterObject.orderedTemplates.join(",");
                axios.get(config.BASE_URL + DECLARE + ORDERED_RELATIONS,{params: {...params, mode: "simple", constraint: constraintParam}}).then((response) => response.data).then((resp) => {
                    setLoadingModes(false);
                    setOrderedRelations({
                        mode: resp?.mode,
                        response: modesFilterObject.orderedTemplates.includes("response") ? resp?.response : undefined,
                        precedence: modesFilterObject.orderedTemplates.includes("precedence") ? resp?.precedence : undefined,
                        succession: modesFilterObject.orderedTemplates.includes("succession") ? resp?.succession : undefined,
                        notSuccession: modesFilterObject.orderedTemplates.includes("notSuccession") ? resp?.notSuccession : undefined,
                    });
                });
            } else {
                setOrderedRelations(undefined);
            }

            if (modesFilterObject.orderedAlternateTemplates.length > 0) {
                const constraintParam = modesFilterObject.orderedAlternateTemplates.join(",");
                axios.get(config.BASE_URL + DECLARE + ORDERED_RELATIONS,{params: {...params, mode: "alternate", constraint: constraintParam}}).then((response) => response.data).then((resp) => {
                    setLoadingModes(false);
                    setOrderedRelationsAlternate({
                        mode: resp?.mode,
                        response: modesFilterObject.orderedAlternateTemplates.includes("response") ? resp?.response : undefined,
                        precedence: modesFilterObject.orderedAlternateTemplates.includes("precedence") ? resp?.precedence : undefined,
                        succession: modesFilterObject.orderedAlternateTemplates.includes("succession") ? resp?.succession : undefined,
                        notSuccession: modesFilterObject.orderedAlternateTemplates.includes("notSuccession") ? resp?.notSuccession : undefined,
                    });
                });
            } else {
                setOrderedRelationsAlternate(undefined);
            }

            if (modesFilterObject.orderedChainTemplates.length > 0) {
                const constraintParam = modesFilterObject.orderedChainTemplates.join(",");
                axios.get(config.BASE_URL + DECLARE + ORDERED_RELATIONS,{params: {...params, mode: "chain", constraint: constraintParam}}).then((response) => response.data).then((resp) => {
                    setLoadingModes(false);
                    setOrderedRelationsChain({
                        mode: resp?.mode,
                        response: modesFilterObject.orderedChainTemplates.includes("response") ? resp?.response : undefined,
                        precedence: modesFilterObject.orderedChainTemplates.includes("precedence") ? resp?.precedence : undefined,
                        succession: modesFilterObject.orderedChainTemplates.includes("succession") ? resp?.succession : undefined,
                        notSuccession: modesFilterObject.orderedChainTemplates.includes("notSuccession") ? resp?.notSuccession : undefined,
                    });
                });
            } else {
                setOrderedRelationsChain(undefined);
            }

        }
    }, [config]);

    const resetModesState = useCallback(() => {
        setPositionPatterns(undefined);
        setExistencePatterns(undefined);
        setOrderedRelations(undefined);
        setOrderedRelationsAlternate(undefined);
        setOrderedRelationsChain(undefined);
        setLoadingModes(null);
    }, []);

    return {
        getModes,
        positionPatterns,
        existencePatterns,
        orderedRelations,
        orderedRelationsAlternate,
        orderedRelationsChain,
        loadingModes,
        resetModesState
    }

};
