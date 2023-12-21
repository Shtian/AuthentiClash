<script>
	import { enhance } from '$app/forms';

	let name = '';
	let endTime = '';
	let loading = false;

	function handleSubmit() {
		// Handle form submission here
		console.log('Name:', name);
		console.log('End Time:', endTime);
	}
</script>

<form method="post" action="?/update" use:enhance={handleSubmit}>
	<div class="space-y-12">
		<div class="border-b border-white/10 pb-12">
			<h2 class="text-base font-semibold leading-7 text-white">Create an AuthentiClash!</h2>
			<p class="mt-1 text-sm leading-6 text-gray-400">
				You will get a shareable code after the game has been created.
			</p>

			<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
				<div class="sm:col-span-4">
					<label for="game-name" class="block text-sm font-medium leading-6 text-white"
						>Game name</label
					>
					<div class="mt-2">
						<div
							class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500"
						>
							<input
								type="text"
								name="game-name"
								id="game-name"
								autocomplete="name"
								value={name}
								class="flex-1 border-0 bg-transparent py-1.5 pl-1 text-white focus:ring-0 sm:text-sm sm:leading-6"
							/>
						</div>
					</div>
				</div>
				<div class="sm:col-span-4">
					<label for="username" class="block text-sm font-medium leading-6 text-white"
						>Username</label
					>
					<div class="mt-2">
						<div
							class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500"
						>
							<input
								type="text"
								name="username"
								id="username"
								autocomplete="username"
								value={endTime}
								class="flex-1 border-0 bg-transparent py-1.5 pl-1 text-white focus:ring-0 sm:text-sm sm:leading-6"
								minlength="3"
								required
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-6 flex items-center gap-x-6">
		<button
			type="submit"
			class="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
			disabled={loading}>{loading ? 'Saving...' : 'Save'}</button
		>
	</div>
</form>
