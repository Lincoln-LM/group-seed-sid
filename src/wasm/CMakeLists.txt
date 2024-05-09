cmake_minimum_required(VERSION 3.16)

project(Wasm)

list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_LIST_DIR}/lib/PokeFinder/CMake")

option(TEST "Run Tests" OFF)

if (TEST)
    add_compile_definitions(TEST)
    enable_testing()
endif ()

include_directories(lib/PokeFinder/Source)

add_subdirectory(lib/PokeFinder/Source/Core)
install(TARGETS PokeFinderCore DESTINATION lib/PokeFinder/Source/Core)
