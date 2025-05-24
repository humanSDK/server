import { enumType, inputObjectType } from "nexus";
import { GraphQLDateTime } from 'graphql-scalars';
import { asNexusMethod } from 'nexus';
// Enum for sort order
export const SortOrder = enumType({
	name: 'SortOrder',
	members: ['ASC', 'DESC'],
});

export const SortInput = inputObjectType({
	name: 'SortInput',
	definition(t) {
		t.string('field_name');
		t.field('order', { type: SortOrder });
	},
});

export const GQLDateTime = asNexusMethod(GraphQLDateTime, 'DateTime');
