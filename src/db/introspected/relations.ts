import { relations } from "drizzle-orm/relations";
import { progressReportsInContent, reportSectionsInContent, permitDetailsInHousing, permitActivitiesInHousing, cewActionsInEnvironment, cewActionHistoryInEnvironment, scorecardsInPerformance, containersInPerformance, measuresInPerformance, measureValuesInPerformance, measureChangesInPerformance, ingestRunsInPerformance, facilities, facilityContacts, placementRequests, placementWorkers, matches, availability, availabilityEvents, consents, referralPackets, workerSessions, members, dataFlags, topicProposals, proposalVotes, measureInstancesInPerformance, measureNotesInPerformance } from "./schema";

export const reportSectionsInContentRelations = relations(reportSectionsInContent, ({one}) => ({
	progressReportsInContent: one(progressReportsInContent, {
		fields: [reportSectionsInContent.reportId],
		references: [progressReportsInContent.id]
	}),
}));

export const progressReportsInContentRelations = relations(progressReportsInContent, ({many}) => ({
	reportSectionsInContents: many(reportSectionsInContent),
}));

export const permitActivitiesInHousingRelations = relations(permitActivitiesInHousing, ({one}) => ({
	permitDetailsInHousing: one(permitDetailsInHousing, {
		fields: [permitActivitiesInHousing.detailId],
		references: [permitDetailsInHousing.detailId]
	}),
}));

export const permitDetailsInHousingRelations = relations(permitDetailsInHousing, ({many}) => ({
	permitActivitiesInHousings: many(permitActivitiesInHousing),
}));

export const cewActionHistoryInEnvironmentRelations = relations(cewActionHistoryInEnvironment, ({one}) => ({
	cewActionsInEnvironment: one(cewActionsInEnvironment, {
		fields: [cewActionHistoryInEnvironment.actionId],
		references: [cewActionsInEnvironment.actionId]
	}),
}));

export const cewActionsInEnvironmentRelations = relations(cewActionsInEnvironment, ({many}) => ({
	cewActionHistoryInEnvironments: many(cewActionHistoryInEnvironment),
}));

export const containersInPerformanceRelations = relations(containersInPerformance, ({one, many}) => ({
	scorecardsInPerformance: one(scorecardsInPerformance, {
		fields: [containersInPerformance.scorecardId],
		references: [scorecardsInPerformance.scorecardId]
	}),
	measureInstancesInPerformances: many(measureInstancesInPerformance),
}));

export const scorecardsInPerformanceRelations = relations(scorecardsInPerformance, ({many}) => ({
	containersInPerformances: many(containersInPerformance),
	measureInstancesInPerformances: many(measureInstancesInPerformance),
}));

export const measureValuesInPerformanceRelations = relations(measureValuesInPerformance, ({one}) => ({
	measuresInPerformance: one(measuresInPerformance, {
		fields: [measureValuesInPerformance.measureId],
		references: [measuresInPerformance.measureId]
	}),
}));

export const measuresInPerformanceRelations = relations(measuresInPerformance, ({many}) => ({
	measureValuesInPerformances: many(measureValuesInPerformance),
	measureChangesInPerformances: many(measureChangesInPerformance),
	measureInstancesInPerformances: many(measureInstancesInPerformance),
	measureNotesInPerformances: many(measureNotesInPerformance),
}));

export const measureChangesInPerformanceRelations = relations(measureChangesInPerformance, ({one}) => ({
	measuresInPerformance: one(measuresInPerformance, {
		fields: [measureChangesInPerformance.measureId],
		references: [measuresInPerformance.measureId]
	}),
	ingestRunsInPerformance: one(ingestRunsInPerformance, {
		fields: [measureChangesInPerformance.runId],
		references: [ingestRunsInPerformance.id]
	}),
}));

export const ingestRunsInPerformanceRelations = relations(ingestRunsInPerformance, ({many}) => ({
	measureChangesInPerformances: many(measureChangesInPerformance),
}));

export const facilityContactsRelations = relations(facilityContacts, ({one}) => ({
	facility: one(facilities, {
		fields: [facilityContacts.facilityId],
		references: [facilities.id]
	}),
}));

export const facilitiesRelations = relations(facilities, ({many}) => ({
	facilityContacts: many(facilityContacts),
	placementRequests: many(placementRequests),
	matches: many(matches),
	availabilities: many(availability),
	availabilityEvents: many(availabilityEvents),
	consents: many(consents),
	referralPackets: many(referralPackets),
}));

export const placementRequestsRelations = relations(placementRequests, ({one, many}) => ({
	facility: one(facilities, {
		fields: [placementRequests.matchedFacilityId],
		references: [facilities.id]
	}),
	placementWorker: one(placementWorkers, {
		fields: [placementRequests.requesterWorkerId],
		references: [placementWorkers.id]
	}),
	matches: many(matches),
	consents: many(consents),
	referralPackets: many(referralPackets),
}));

export const placementWorkersRelations = relations(placementWorkers, ({many}) => ({
	placementRequests: many(placementRequests),
	consents: many(consents),
	referralPackets: many(referralPackets),
	workerSessions: many(workerSessions),
}));

export const matchesRelations = relations(matches, ({one, many}) => ({
	facility: one(facilities, {
		fields: [matches.facilityId],
		references: [facilities.id]
	}),
	placementRequest: one(placementRequests, {
		fields: [matches.requestId],
		references: [placementRequests.id]
	}),
	referralPackets: many(referralPackets),
}));

export const availabilityRelations = relations(availability, ({one}) => ({
	facility: one(facilities, {
		fields: [availability.facilityId],
		references: [facilities.id]
	}),
}));

export const availabilityEventsRelations = relations(availabilityEvents, ({one}) => ({
	facility: one(facilities, {
		fields: [availabilityEvents.facilityId],
		references: [facilities.id]
	}),
}));

export const consentsRelations = relations(consents, ({one, many}) => ({
	placementWorker: one(placementWorkers, {
		fields: [consents.recordedByWorkerId],
		references: [placementWorkers.id]
	}),
	placementRequest: one(placementRequests, {
		fields: [consents.requestId],
		references: [placementRequests.id]
	}),
	facility: one(facilities, {
		fields: [consents.sharedWithFacilityId],
		references: [facilities.id]
	}),
	referralPackets: many(referralPackets),
}));

export const referralPacketsRelations = relations(referralPackets, ({one}) => ({
	consent: one(consents, {
		fields: [referralPackets.consentId],
		references: [consents.id]
	}),
	placementWorker: one(placementWorkers, {
		fields: [referralPackets.createdByWorkerId],
		references: [placementWorkers.id]
	}),
	facility: one(facilities, {
		fields: [referralPackets.facilityId],
		references: [facilities.id]
	}),
	match: one(matches, {
		fields: [referralPackets.matchId],
		references: [matches.id]
	}),
	placementRequest: one(placementRequests, {
		fields: [referralPackets.requestId],
		references: [placementRequests.id]
	}),
}));

export const workerSessionsRelations = relations(workerSessions, ({one}) => ({
	placementWorker: one(placementWorkers, {
		fields: [workerSessions.workerId],
		references: [placementWorkers.id]
	}),
}));

export const dataFlagsRelations = relations(dataFlags, ({one}) => ({
	member: one(members, {
		fields: [dataFlags.memberId],
		references: [members.id]
	}),
}));

export const membersRelations = relations(members, ({many}) => ({
	dataFlags: many(dataFlags),
	topicProposals: many(topicProposals),
	proposalVotes: many(proposalVotes),
}));

export const topicProposalsRelations = relations(topicProposals, ({one, many}) => ({
	member: one(members, {
		fields: [topicProposals.memberId],
		references: [members.id]
	}),
	proposalVotes: many(proposalVotes),
}));

export const proposalVotesRelations = relations(proposalVotes, ({one}) => ({
	member: one(members, {
		fields: [proposalVotes.memberId],
		references: [members.id]
	}),
	topicProposal: one(topicProposals, {
		fields: [proposalVotes.proposalId],
		references: [topicProposals.id]
	}),
}));

export const measureInstancesInPerformanceRelations = relations(measureInstancesInPerformance, ({one}) => ({
	containersInPerformance: one(containersInPerformance, {
		fields: [measureInstancesInPerformance.containerId],
		references: [containersInPerformance.containerId]
	}),
	measuresInPerformance: one(measuresInPerformance, {
		fields: [measureInstancesInPerformance.measureId],
		references: [measuresInPerformance.measureId]
	}),
	scorecardsInPerformance: one(scorecardsInPerformance, {
		fields: [measureInstancesInPerformance.scorecardId],
		references: [scorecardsInPerformance.scorecardId]
	}),
}));

export const measureNotesInPerformanceRelations = relations(measureNotesInPerformance, ({one}) => ({
	measuresInPerformance: one(measuresInPerformance, {
		fields: [measureNotesInPerformance.measureId],
		references: [measuresInPerformance.measureId]
	}),
}));