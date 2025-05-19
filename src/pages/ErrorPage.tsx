import { Box, Flex, Heading, Text } from '@radix-ui/themes';

const ErrorPage: React.FC<unknown> = () => {
	return (
		<>
			<Box>
				<Flex direction="column" align="center" justify="center" className="h-screen">
					<Heading size="9">Oops!</Heading>
					<Box height="24px" />
					<Text>You're on the wrong page pall</Text>
					<Box height="8px" />
					<Text className="opacity-50">Not Found</Text>
				</Flex>
			</Box>
		</>
	);
};
export default ErrorPage;
