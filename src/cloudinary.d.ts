declare module 'cloudinary' {
    namespace cloudinary {
      namespace v2 {
        function config(options: {
          cloud_name: string;
          api_key: string;
          api_secret: string;
        }): void;
      }
    }
    export = cloudinary;
  }