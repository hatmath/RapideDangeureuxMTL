const { Schema } = require("mongoose");

const apiSchema = new Schema({

    NO_SEQ_COLL: {type: String, required: true, maxLength: 15},
	JR_SEMN_ACCDN: {type: String, required: false, maxLength: 2},
	DT_ACCDN: {type: String, required: false, maxLength: 10},
	CD_MUNCP: {type: String, required: false, maxLength: 5},
	NO_CIVIQ_ACCDN: {type: String, required: false, maxLength: 5},
	SFX_NO_CIVIQ_ACCDN: {type: String, required: false, maxLength: 3},
	BORNE_KM_ACCDN: {type: Int, required: false, maxLength: 8},
	RUE_ACCDN: {type: String, required: false, maxLength: 34},
	TP_REPRR_ACCDN: {type: String, required: false, maxLength: 1},
	ACCDN_PRES_DE: {type: String, required: false, maxLength: 34},
	NB_METRE_DIST_ACCD: {type: String, required: false, maxLength: 2},
	CD_GENRE_ACCDN: {type: String, required: false, maxLength: 2},
	CD_SIT_PRTCE_ACCDN: {type: String, required: false, maxLength: 1},
	CD_ETAT_SURFC: {type: String, required: false, maxLength: 2},
	CD_ECLRM: {type: String, required: false, maxLength: 1},
	CD_ENVRN_ACCDN: {type: String, required: false, maxLength: 1},
	NO_ROUTE: {type: String, required: false, maxLength: 3},
	CD_CATEG_ROUTE: {type: String, required: false, maxLength: 2},
	CD_ETAT_CHASS: {type: String, required: false, maxLength: 1},
	CD_ASPCT_ROUTE: {type: String, required: false, maxLength: 2},
	CD_LOCLN_ACCDN: {type: String, required: false, maxLength: 2},
	CD_POSI_ACCDN: {type: String, required: false, maxLength: 2},
	CD_CONFG_ROUTE: {type: String, required: false, maxLength: 1},
	CD_ZON_TRAVX_ROUTR: {type: String, required: false, maxLength: 1},
	CD_PNT_CDRNL_ROUTE: {type: String, required: false, maxLength: 1},
	CD_PNT_CDRNL_REPRR: {type: String, required: false, maxLength: 1},
	CD_COND_METEO: {type: String, required: false, maxLength: 2},
	NB_VEH_IMPLIQUES_ACCDN: {type: Int, required: false, maxLength: 8},
	NB_MORTS: {type: Int, required: false, maxLength: 8},
	NB_BLESSES_GRAVES: {type: Int, required: false, maxLength: 8},
	NB_BLESSES_LEGERS: {type: Int, required: false, maxLength: 8},
	HEURE_ACCDN: {type: String, required: false, maxLength: 20},
	AN: {type: Int, required: false, maxLength: 8},
	NB_VICTIMES_TOTAL: {type: Int, required: false, maxLength: 8},
	GRAVITE: {type: String, required: false, maxLength: 54},
	REG_ADM: {type: String, required: false, maxLength: 40},
	MRC: {type: String, required: false, maxLength: 36},
	nb_automobile_camion_leger: {type: Int, required: false, maxLength: 8},
	nb_camionLourd_tractRoutier: {type: Int, required: false, maxLength: 8},
	nb_outil_equipement: {type: Int, required: false, maxLength: 8},
	nb_tous_autobus_minibus: {type: Int, required: false, maxLength: 8},
	nb_bicyclette: {type: Int, required: false, maxLength: 8},
	nb_cyclomoteur: {type: Int, required: false, maxLength: 8},
	nb_motocyclette: {type: Int, required: false, maxLength: 8},
	nb_taxi: {type: Int, required: false, maxLength: 8},
	nb_urgence: {type: Int, required: false, maxLength: 8},
	nb_motoneige: {type: Int, required: false, maxLength: 8},
	nb_VHR: {type: Int, required: false, maxLength: 8},
	nb_autres_types: {type: Int, required: false, maxLength: 8},
	nb_veh_non_precise: {type: Int, required: false, maxLength: 8},
	NB_DECES_PIETON: {type: Int, required: false, maxLength: 8},
	NB_BLESSES_PIETON: {type: Int, required: false, maxLength: 8},
	NB_VICTIMES_PIETON: {type: Int, required: false, maxLength: 8},
	NB_DECES_MOTO: {type: Int, required: false, maxLength: 8},
	NB_BLESSES_MOTO: {type: Int, required: false, maxLength: 8},
	NB_VICTIMES_MOTO: {type: Int, required: false, maxLength: 8},
	NB_DECES_VELO: {type: Int, required: false, maxLength: 8},
	NB_BLESSES_VELO: {type: Int, required: false, maxLength: 8},
	NB_VICTIMES_VELO: {type: Int, required: false, maxLength: 8},
	VITESSE_AUTOR: {type: Int, required: false, maxLength: 8},
	LOC_X: {type: Double, required: false, maxLength: 24},
	LOC_Y: {type: Double, required: false, maxLength: 24},
	LOC_COTE_QD: {type: String, required: false, maxLength: 1},
	LOC_COTE_PD: {type: String, required: false, maxLength: 1},
	LOC_DETACHEE: {type: String, required: false, maxLength: 1},
	LOC_IMPRECISION: {type: String, required: false, maxLength: 1},
	LOC_LONG: {type: Double, required: false, maxLength: 24},
	LOC_LAT: {type: Double, required: false, maxLength: 24}

})