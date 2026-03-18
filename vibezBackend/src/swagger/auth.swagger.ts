const AuthApiDoc ={
    "/auth/signup":{
        post:{
            summary : "Register a new user",
            tags: ["Auth"],
            requestBody:{
                required: true,
                content:{
                    "application/json":{
                        schema:{
                            type :"object",
                            properties:{
                                fullname:{type:"string"},
                                email:{type:"string"},
                                mobile:{type:"string"},
                                password:{type:"string"}
                            }
                        }
                    }
                }
            },
            responses:{
                200:{
                    description:"Success",
                    content:{
                        "application/json":{
                            schema:{
                                type:"object",
                                properties:{
                                    message:{type:"string",example:"signup success"}
                                }
                            }
                        }
                    }
                },
                500:{
                     description:"Error",
                    content:{
                        "application/json":{
                            schema:{
                                type:"object",
                                properties:{
                                    message:{type:"string"}
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/autth/login":{
        post:{
            summary : "Login successfully",
              tags: ["Auth"],
            requestBody:{
                required: true,
                content:{
                    "application/json":{
                        schema:{
                            type :"object",
                            properties:{
                                email:{type:"string"},
                                password:{type:"string"}
                            }
                        }
                    }
                }
            },
            responses:{
                200:{
                    description:"Success",
                    content:{
                        "application/json":{
                            schema:{
                                type:"object",
                                properties:{
                                    message:{type:"string",example:"Login success"},
                                    accessToekn:{type:"string", example:"valid for 10 minute http only mode"},
                                    refreshToken:{type:"string", example:"valid for 7 days http only mode"}
                                }
                            }
                        }
                    }
                },
                 404:{
                     description:"Error",
                    content:{
                        "application/json":{
                            schema:{
                                type:"object",
                                properties:{
                                    message:{type:"string",example:"User not found, please try to signup first"}
                                }
                            }
                        }
                    }
                },
                401:{
                     description:"Error",
                    content:{
                        "application/json":{
                            schema:{
                                type:"object",
                                properties:{
                                    message:{type:"string",example:"Invalid credentials email or password incorrect"}
                                }
                            }
                        }
                    }
                },
                500:{
                     description:"Error",
                    content:{
                        "application/json":{
                            schema:{
                                type:"object",
                                properties:{
                                    message:{type:"string"}
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/auth/refresh-token":{
            get:{
            summary : "Getting new access and refresh token",
              tags: ["Auth"],
            requestBody:{
                content:{
                    "application/json":{
                        schema:{
                            type :"object",
                            properties:{
                                refreshToken:{type:"string", exampl:"sent from http only cookie"},
                            }
                        }
                    }
                }
            },
            responses:{
                200:{
                    description:"Success",
                    content:{
                        "application/json":{
                            schema:{
                                type:"object",
                                properties:{
                                    message:{type:"string",example:'Access token refreshed successfully'},
                                    accessToekn:{type:"string", example:"valid for 10 minute http only mode"},
                                    refreshToken:{type:"string", example:"valid for 7 days http only mode"}
                                }
                            }
                        }
                    }
                },
                401:{
                     description:"Error",
                    content:{
                        "application/json":{
                            schema:{
                                type:"object",
                                properties:{
                                    message:{type:"string",example:"Failed to refresToken"}
                                }
                            }
                        }
                    }
                },
                500:{
                     description:"Error",
                    content:{
                        "application/json":{
                            schema:{
                                type:"object",
                                properties:{
                                    message:{type:"string"}
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/auth/profile-picture":{
        put:{
            summary : "Login successfully",
              tags: ["Auth"],
            requestBody:{
                required: true,
                content:{
                    "application/json":{
                        schema:{
                            type :"object",
                            properties:{
                                accessToken:{type:"string", example:"sent automatically from htttp only cookie"},
                                image:{type:"string",example:"your image public url"}
                            }
                        }
                    }
                }
            },
            responses:{
                200:{
                    description:"Success",
                    content:{
                        "application/json":{
                            schema:{
                                type:"object",
                                properties:{
                                    image:{type:"string",example:"Invalid session"}
                                }
                            }
                        }
                    }
                },
                401:{
                     description:"Error",
                    content:{
                        "application/json":{
                            schema:{
                                type:"object",
                                properties:{
                                    message:{type:"string",example:"Invalid session"}
                                }
                            }
                        }
                    }
                },
                500:{
                     description:"Error",
                    content:{
                        "application/json":{
                            schema:{
                                type:"object",
                                properties:{
                                    message:{type:"string"}
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/auth/logout":{
        post:{
            summary : "Logout a user",
              tags: ["Auth"],
            responses:{
                200:{
                    description:"Success",
                    content:{
                        "application/json":{
                            schema:{
                                type:"object",
                                properties:{
                                    message:{type:"string",example:"Logout success"},
                                    accessToken:{type:"string",example:"Auto removed from cookie"},
                                    refreshToken:{type:"string",example:"Auto removed from cookie"},
                                }
                            }
                        }
                    }
                },
                500:{
                     description:"Error",
                    content:{
                        "application/json":{
                            schema:{
                                type:"object",
                                properties:{
                                    message:{type:"string"}
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/auth/session":{
         get:{
            summary : "Getting user info from token",
            tags: ["Auth"],
            requestBody:{
                content:{
                    "application/json":{
                        schema:{
                            type :"object",
                            properties:{
                                accessToken:{type:"string", example:"sent automatically from http only cokkie"}
                            }
                        }
                    }
                }
            },
            responses:{
                200:{
                    description:"Success",
                    content:{
                        "application/json":{
                            schema:{
                                type:"object",
                                properties:{
                                   id:{type:"string"},
                                   email:{type:"string"},
                                   fullname:{type:"string"},
                                   image:{type:"string"},
                                   mobile:{type:"string"},
                                }
                            }
                        }
                    }
                },
                401:{
                     description:"Error",
                    content:{
                        "application/json":{
                            schema:{
                                type:"object",
                                properties:{
                                    message:{type:"string",example:"Invalid session"}
                                }
                            }
                        }
                    }
                },
                500:{
                     description:"Error",
                    content:{
                        "application/json":{
                            schema:{
                                type:"object",
                                properties:{
                                    message:{type:"string"}
                                }
                            }
                        }
                    }
                }
            }
        }
    }
 }


export default AuthApiDoc