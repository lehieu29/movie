import { db } from '~/firebase/config';
import { doc, setDoc, updateDoc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export const addSaveMovies = async (movieDetails, user) => {
    try {
        await updateDoc(doc(db, 'saveMovies', user.uid), {
            saveMovie: arrayUnion(movieDetails),
        });
    } catch (e) {
        await setDoc(doc(db, 'saveMovies', user.uid), {
            user: {
                displayName: user.displayName,
                email: user.email,
            },
            saveMovie: [movieDetails],
        });
    }
};

export const removeSaveMovies = async (movieDetails, uid) => {
    try {
        await updateDoc(doc(db, 'saveMovies', uid), {
            saveMovie: arrayRemove(movieDetails),
        });
    } catch (e) {
        console.log(e);
    }
};

export const getSaveMovies = async (uid) => {
    const docSnap = await getDoc(doc(db, 'saveMovies', uid));

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return 'you have not saved any movies yet';
    }
};
