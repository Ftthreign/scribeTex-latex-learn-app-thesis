<template>
    <div class="bg-gray-100 font-sans leading-normal tracking-normal">
        <nav class="bg-white shadow-lg">
            <div class="container mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <div>
                        <a
                            class="text-2xl font-bold text-gray-800 lg:text-3xl"
                            href="#"
                            >Dashboard</a
                        >
                    </div>
                    <div class="flex">
                        <a class="text-gray-800 hover:text-gray-600" href="#"
                            >Home</a
                        >
                        <a
                            class="mx-4 text-gray-800 hover:text-gray-600"
                            href="#"
                            >Courses</a
                        >
                        <a class="text-gray-800 hover:text-gray-600" href="#"
                            >Profile</a
                        >
                    </div>
                </div>
            </div>
        </nav>

        <div class="container mx-auto mt-10 px-6">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div class="rounded-lg bg-white p-6 shadow-lg">
                    <h2 class="mb-2 text-xl font-bold text-gray-800">Card 1</h2>
                    <p class="text-gray-700">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Integer nec odio. Praesent libero.
                    </p>
                </div>
                <div class="rounded-lg bg-white p-6 shadow-lg">
                    <h2 class="mb-2 text-xl font-bold text-gray-800">Card 2</h2>
                    <p class="text-gray-700">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Integer nec odio. Praesent libero.
                    </p>
                </div>
                <div class="rounded-lg bg-white p-6 shadow-lg">
                    <h2 class="mb-2 text-xl font-bold text-gray-800">Card 3</h2>
                    <p class="text-gray-700">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Integer nec odio. Praesent libero.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "App",
};
</script>
